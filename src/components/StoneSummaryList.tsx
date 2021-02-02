import React from 'react';
import { StoneLocation, ImageDetails } from "../declarations";
import StoneSummaryEntry from "./StoneSummaryEntry";
import { IonList, IonItemDivider, IonLabel } from '@ionic/react';

interface StoneSummaryListProps {
    stoneLocations: StoneLocation[];
    sortMode: 'groupByHold' | undefined;
    setStoneFoundStatus(stoneId: number, value: boolean): any;
    setFocusImage(focusImage: ImageDetails | null): any;
}

const groupStonesByHold = (stoneLocations: StoneLocation[], setStoneFoundStatus: (stoneId: number, value: boolean) => any, setFocusImage: (focusImage: ImageDetails | null) => any) => {
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
                return <StoneSummaryEntry key={stone.stoneId} stone={stone} setStoneFoundStatus={setStoneFoundStatus} sortMode='groupByHold' setFocusImage={setFocusImage}/>;
            })
        ];
    })
}

const unsort = (stoneLocations: StoneLocation[], setStoneFoundStatus: (stoneId: number, value: boolean) => any, setFocusImage: (focusImage: ImageDetails | null) => any) => {
    return stoneLocations.map(stonLoc => {
        return <StoneSummaryEntry key={stonLoc.stoneId} stone={stonLoc} setStoneFoundStatus={setStoneFoundStatus} sortMode={undefined} setFocusImage={setFocusImage}/>
    });
}


const StoneSummaryList: React.FC<StoneSummaryListProps> = ({stoneLocations, sortMode, setStoneFoundStatus, setFocusImage}) => {
    return <IonList>
            {
                sortMode === 'groupByHold' 
                ? groupStonesByHold(stoneLocations, setStoneFoundStatus, setFocusImage)
                : unsort(stoneLocations, setStoneFoundStatus, setFocusImage)
            }
            </IonList>;
}

export default StoneSummaryList;