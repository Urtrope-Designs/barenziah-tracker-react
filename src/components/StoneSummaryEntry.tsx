import { StoneLocation } from "../declarations";
import { IonItem, IonCheckbox, IonLabel, IonButton, IonIcon } from "@ionic/react";
import React, { useState } from "react";
import { STONE_LIST } from "../util/stone-list";
import { addOutline } from "ionicons/icons";

import './StoneSummaryEntry.css';

interface StoneSummaryEntryProps {
    stone: StoneLocation;
    setStoneFoundStatus(stoneId: number, value: boolean): any;
}

const StoneSummaryEntry: React.FC<StoneSummaryEntryProps> = ({ stone, setStoneFoundStatus }) => {
    const [isDetailShown, setIsDetailShown] = useState(false);
    const stoneData = STONE_LIST.find(s => s.stoneId === stone.stoneId);
    return !!stoneData ? (
        <IonItem className="ion-align-items-start">
            <IonLabel className="stoneSummary_headerLabel" onClick={(e) => {
                    setIsDetailShown(!isDetailShown);
                    e.stopPropagation();
                }}
            >
                <h2>{stoneData.locationName}{!!stoneData.sublocationName ? ' - ' + stoneData.sublocationName : ''}</h2>
                <p className="item-note">
                    Hold: {stone.holdName}
                </p>
                {
                    isDetailShown ? 
                        <div className="ion-text-wrap">{stoneData.stonePlacementDescription}</div> :
                        ''
                }
            </IonLabel>
            <IonCheckbox
                slot="start"
                checked={stone.isFound}
                onIonChange={(e) => setStoneFoundStatus(stone.stoneId, e.detail.checked)}
            />
            <IonButton slot="end" fill="clear" onClick={(e) => {setIsDetailShown(!isDetailShown);}}>
                <IonIcon slot="icon-only" icon={addOutline} className={'stoneSummary_showMoreButton' + (isDetailShown ? ' stoneSummary_showMoreButton-detailShown' : '')}/>
            </IonButton>
        </IonItem>
    ) : null;
}

export default StoneSummaryEntry;