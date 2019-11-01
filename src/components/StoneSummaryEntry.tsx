import { StoneLocation } from "../declarations";
import { IonItem, IonCheckbox, IonLabel } from "@ionic/react";
import React from "react";

interface StoneSummaryEntryProps {
    stone: StoneLocation;
}

const StoneSummaryEntry: React.FC<StoneSummaryEntryProps> = ({ stone }) => {
    return (
        <IonItem key={stone.stoneId}>
            <IonCheckbox
                slot="start"
                checked={stone.isFound}
                // onIonChange={() => onItemClick(stone.stoneId)}
            />
            <IonLabel>
                <h2>{stone.locationName}</h2>
                <p className="item-note">
                    Hold: {stone.holdName}
                </p>
            </IonLabel>
        </IonItem>
    );
}

export default StoneSummaryEntry;