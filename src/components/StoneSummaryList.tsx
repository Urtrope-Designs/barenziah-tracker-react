import React, { useRef } from 'react';
import { StoneLocation } from "../declarations";
import StoneSummaryEntry, { toggleShowDetailCallbackContents } from "./StoneSummaryEntry";
import { IonList, IonItemDivider, IonLabel, createAnimation, Animation } from '@ionic/react';

interface StoneSummaryListProps {
    stoneLocations: StoneLocation[];
    sortMode: 'groupByHold' | undefined;
    setStoneFoundStatus(stoneId: number, value: boolean): any;
}

const groupStonesByHold = (stoneLocations: StoneLocation[], setStoneFoundStatus: (stoneId: number, value: boolean) => any, toggleShowDetail: (contents: toggleShowDetailCallbackContents) => void) => {
    const groupedStones: {holdName: string, stones: StoneLocation[]}[] = [];
    stoneLocations.forEach((next: StoneLocation) => {
        const existingGroup = groupedStones.find(group => group.holdName === next.holdName);
        if (!!existingGroup) {
            if (!!existingGroup.stones) {
                existingGroup.stones.push(next);
            } else {
                existingGroup.stones = [];
            }
        } else {
            groupedStones.push({holdName: next.holdName, stones: [next]})
        }
        return groupedStones;
    }, {});
    const sortedGroups = groupedStones.sort((a, b) => {
        const aName = a.holdName.toLocaleLowerCase();
        const bName = b.holdName.toLocaleLowerCase();
        if (aName < bName) {
            return -1;
        }
        if (aName > bName) {
            return 1;
        }
        return 0;
    });

    return sortedGroups.map((group: {holdName: string, stones: StoneLocation[]}) => {
        return [
            <IonItemDivider key={group.holdName}><IonLabel>Hold: {group.holdName}</IonLabel></IonItemDivider>,
            group.stones.map(stone => {
                return <StoneSummaryEntry key={stone.stoneId} stone={stone} setStoneFoundStatus={setStoneFoundStatus} sortMode='groupByHold' toggleShowDetail={toggleShowDetail}/>;
            })
        ];
    })
}

const unsort = (stoneLocations: StoneLocation[], setStoneFoundStatus: (stoneId: number, value: boolean) => any, toggleShowDetail: (contents: toggleShowDetailCallbackContents) => void) => {
    return stoneLocations.map(stonLoc => {
        return <StoneSummaryEntry key={stonLoc.stoneId} stone={stonLoc} setStoneFoundStatus={setStoneFoundStatus} sortMode={undefined} toggleShowDetail={toggleShowDetail}/>
    });
}


const StoneSummaryList: React.FC<StoneSummaryListProps> = ({stoneLocations, sortMode, setStoneFoundStatus}) => {
    const hostRef = useRef<HTMLIonListElement | null>(null);
    const blockerRef = useRef<HTMLDivElement | null>(null);
    let elementsToShift: Array<any>;
    let currentlyOpen: toggleShowDetailCallbackContents | null = null;

    let shiftDownAnimation: Animation;
    let blockerDownAnimation: Animation;

    const toggleShowDetail = async (contents: toggleShowDetailCallbackContents) => {
        if (!hostRef.current || !blockerRef.current) {
            return;
        }
        contents.shouldOpen ? await animateOpen(contents) : await animateClose(contents);

        contents.endTransition();
    }

    const closeOpenItem = async () => {
        if (currentlyOpen !== null) {
            const itemToClose = currentlyOpen;
        
            itemToClose.startTransition();
            await animateClose(currentlyOpen);
            itemToClose.endTransition();
            itemToClose.setClosed();
            return true;
        }
    }

    const animateOpen = async (contents: toggleShowDetailCallbackContents) => {
        if (!hostRef.current || !blockerRef.current) {
            return;
        }

        // Close any open item first
        await closeOpenItem();
        currentlyOpen = contents;

        // Create an array of all accordion items
        const items = Array.from(hostRef.current.children);

        // Find the item being opened, and create a new array with only the elements beneath the element being opened
        let splitOnIndex = 0;

        items.forEach((item, index) => {
            if (item === contents.element) {
                splitOnIndex = index;
            }
        });

        elementsToShift = [...items].splice(splitOnIndex + 1, items.length - (splitOnIndex + 1));

        // Set item content to be visible
        contents.content.style.display = 'block';

        // Calculate the amount other items need to be shifted
        const amountToShift = contents.content.clientHeight;
        const openAnimationTime = 400;

        // Initially set all items below the one being opened to cover the new content
        // but then animate back to their normal position to reveal the content
        shiftDownAnimation = createAnimation()
            .addElement(elementsToShift)
            .delay(20)
            .beforeStyles({
                'transform': `translateY(-${amountToShift}px)`,
                'position': 'relative',
                'z-index': '1',
            })
            .afterClearStyles(['position', 'z-index'])
            .to('transform', 'translateY(0)')
            .duration(openAnimationTime)
            // .easing('cubic-bezier(0.32,0.72,0,1)');
            .easing('ease-out');

        // This blocker element is placed after the last item in the accordion list
        // It will change its height to the height of the content being displayed so that
        // the content doesn't leak out the bottom of the list
        blockerDownAnimation = createAnimation()
            .addElement(blockerRef.current)
            .delay(20)
            .beforeStyles({
                'transform': `translateY(-${amountToShift}px)`,
                'height': `${amountToShift}px`,
            })
            .to('transform', 'translateY(0)')
            .duration(openAnimationTime)
            // .easing('cubic-bezier(0.32,0.72,0,1)');
            .easing('ease-out');

        return await Promise.all([shiftDownAnimation.play(), blockerDownAnimation.play()]);
    };

    const animateClose = async (contents: toggleShowDetailCallbackContents) => {
        if (!hostRef.current || !blockerRef.current) {
            return;
        }

        currentlyOpen = null;
        const amountToShift = contents.content.clientHeight;

        const closeAnimationTime = 400;

        // Now we first animate up the elements beneath the content that was opened to cover it
        // and then we set the content back to display: none and remove the transform completely
        // With the content gone, there will be no noticeable position change when removing the transform
        const shiftUpAnimation: Animation = createAnimation()
            .addElement(elementsToShift)
            .afterStyles({
                'transform': 'translateY(0)',
            })
            .to('transform', `translateY(-${amountToShift}px)`)
            .afterAddWrite(() => {
                shiftDownAnimation.destroy();
                blockerDownAnimation.destroy();
            })
            .duration(closeAnimationTime)
            // .easing('cubic-bezier(0.32,0.72,0,1)');
            .easing('ease-out');

        const blockerUpAnimation: Animation = createAnimation()
            .addElement(blockerRef.current)
            .afterStyles({
                'transform': 'translateY(0)',
            })
            .to('transform', `translateY(-${amountToShift}px)`)
            .duration(closeAnimationTime)
            // .easing('cubic-bezier(0.32,0.72,0,1)');
            .easing('ease-out');

        await Promise.all([shiftUpAnimation.play(), blockerUpAnimation.play()]);

        // Hide the content again
        contents.content.style.display = 'none';

        // Destroy the animations to reset the CSS values that they applied. This will remove the transforms instantly.
        shiftUpAnimation.destroy();
        blockerUpAnimation.destroy();

        return true;
    };

    return (
        <React.Fragment>
            <IonList ref={hostRef}>
            {
                sortMode === 'groupByHold' 
                ? groupStonesByHold(stoneLocations, setStoneFoundStatus, toggleShowDetail)
                : unsort(stoneLocations, setStoneFoundStatus, toggleShowDetail)
            }
            </IonList>;
            <div ref={blockerRef}></div>
        </React.Fragment>
    );
}

export default StoneSummaryList;