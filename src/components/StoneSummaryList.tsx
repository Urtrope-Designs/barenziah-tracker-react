import React from 'react';
import { StoneLocation } from "../declarations";
import StoneSummaryEntry from "./StoneSummaryEntry";
import { IonList } from '@ionic/react';

interface StoneSummaryListProps {
    stoneLocations: StoneLocation[];
    toggleStoneFoundStatus(stoneId: number): any;
}

const StoneSummaryList: React.FC<StoneSummaryListProps> = ({stoneLocations, toggleStoneFoundStatus}) => {
    const stones = stoneLocations.map(stonLoc => {
        return <StoneSummaryEntry key={stonLoc.stoneId} stone={stonLoc} toggleStoneFoundStatus={toggleStoneFoundStatus}/>;
    })

    return <IonList>{stones}</IonList>;
}

export default StoneSummaryList;