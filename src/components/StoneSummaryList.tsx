import React from 'react';
import { StoneLocation } from "../declarations";
import StoneSummaryEntry from "./StoneSummaryEntry";
import { IonList } from '@ionic/react';

interface StoneSummaryListProps {
    stoneLocations: StoneLocation[];
    setStoneFoundStatus(stoneId: number, value: boolean): any;
}

const StoneSummaryList: React.FC<StoneSummaryListProps> = ({stoneLocations, setStoneFoundStatus}) => {
    const stones = stoneLocations.map(stonLoc => {
        return <StoneSummaryEntry key={stonLoc.stoneId} stone={stonLoc} setStoneFoundStatus={setStoneFoundStatus}/>;
    })

    return <IonList>{stones}</IonList>;
}

export default StoneSummaryList;