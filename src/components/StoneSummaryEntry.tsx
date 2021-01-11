import { StoneLocation } from "../declarations";
import { IonItem, IonCheckbox, IonLabel } from "@ionic/react";
import React from "react";
import { STONE_LIST } from "../util/stone-list";

interface StoneSummaryEntryProps {
    stone: StoneLocation;
    setStoneFoundStatus(stoneId: number, value: boolean): any;
}

const StoneSummaryEntry: React.FC<StoneSummaryEntryProps> = ({ stone, setStoneFoundStatus }) => {
    const stoneData = STONE_LIST.find(s => s.stoneId === stone.stoneId);
    return !!stoneData ? (
        <IonItem>
            <IonCheckbox
                slot="start"
                checked={stone.isFound}
                onIonChange={(e) => setStoneFoundStatus(stone.stoneId, e.detail.checked)}
            />
            <IonLabel>
                <h2>{stoneData.locationName}{!!stoneData.sublocationName ? ' - ' + stoneData.sublocationName : ''}</h2>
                <p className="item-note">
                    Hold: {stone.holdName}
                </p>
            </IonLabel>
        </IonItem>
    ) : null;
}

export default StoneSummaryEntry;