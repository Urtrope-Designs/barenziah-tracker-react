import React from 'react';
import { StoneLocation } from "../declarations";
import StoneSummaryEntry from "./StoneSummaryEntry";
import { IonList } from '@ionic/react';

interface StoneSummaryListProps {
    stoneLocations: StoneLocation[];
}

const StoneSummaryList: React.FC<StoneSummaryListProps> = ({stoneLocations}) => {
    const stones = stoneLocations.map(stonLoc => {
        return <StoneSummaryEntry stone={stonLoc}/>;
    })

    return <IonList>{stones}</IonList>;
}

export default StoneSummaryList;