import React from 'react';
import { StoneLocation } from "../declarations";
import StoneSummaryEntry from "./StoneSummaryEntry";
import { IonList, IonItemDivider, IonLabel } from '@ionic/react';

interface StoneSummaryListProps {
    stoneLocations: StoneLocation[];
    setStoneFoundStatus(stoneId: number, value: boolean): any;
}

const StoneSummaryList: React.FC<StoneSummaryListProps> = ({stoneLocations, setStoneFoundStatus}) => {
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
    
    return <IonList>
        {
            sortedGroups.map((group: {holdName: string, stones: StoneLocation[]}) => {
                return [
                    <IonItemDivider key={group.holdName}><IonLabel>Hold: {group.holdName}</IonLabel></IonItemDivider>,
                    group.stones.map(stone => {
                        return <StoneSummaryEntry key={stone.stoneId} stone={stone} setStoneFoundStatus={setStoneFoundStatus}/>;
                    })
                ];
            })
        }
        </IonList>;
}

export default StoneSummaryList;