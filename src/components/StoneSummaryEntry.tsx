import { StoneLocation } from "../declarations";
import { IonItem, IonCheckbox, IonLabel } from "@ionic/react";
import React from "react";

interface StoneSummaryEntryProps {
    stone: StoneLocation;
    setStoneFoundStatus(stoneId: number, value: boolean): any;
}

const StoneSummaryEntry: React.FC<StoneSummaryEntryProps> = ({ stone, setStoneFoundStatus }) => {
    return (
        <IonItem>
            <IonCheckbox
                slot="start"
                checked={stone.isFound}
                onIonChange={(e) => setStoneFoundStatus(stone.stoneId, e.detail.checked)}
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