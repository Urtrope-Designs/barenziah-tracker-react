import { StoneLocation } from "../declarations";
import { IonItem, IonLabel, IonIcon, IonItemSliding, IonItemOptions, IonItemOption, } from "@ionic/react";
import React, { useState, useRef } from "react";
import { STONE_LIST } from "../util/stone-list";
import { addOutline, checkboxOutline, backspaceOutline } from "ionicons/icons";

import './StoneSummaryEntry.css';

interface StoneSummaryEntryProps {
    stone: StoneLocation;
    setStoneFoundStatus(stoneId: number, value: boolean): any;
}

const StoneSummaryEntry: React.FC<StoneSummaryEntryProps> = ({ stone, setStoneFoundStatus }) => {
    const [isDetailShown, setIsDetailShown] = useState(false);
    const itemSlidingRef = useRef<HTMLIonItemSlidingElement | null>(null);
    const stoneData = STONE_LIST.find(s => s.stoneId === stone.stoneId);
    const toggleStoneFoundStatus = () => {
        setStoneFoundStatus(stone.stoneId, !stone.isFound);
        itemSlidingRef.current?.close()
    }
    return !!stoneData ? (
        <div>
            <IonItemSliding ref={itemSlidingRef}>
                <IonItem color={(stone.isFound ? 'primary' : undefined)} lines={isDetailShown ? 'none' : 'full'} onClick={(e) => setIsDetailShown(!isDetailShown)}>
                    <IonLabel className="stoneSummary_headerLabel">
                        <h2>{stoneData.locationName}{!!stoneData.sublocationName ? ' - ' + stoneData.sublocationName : ''}</h2>
                        <p className="item-note">
                            Hold: {stone.holdName}
                        </p>
                    </IonLabel>
                    <IonIcon slot="end" icon={addOutline} className={'stoneSummary_showMoreButton' + (isDetailShown ? ' stoneSummary_showMoreButton-detailShown' : '')}/>
                </IonItem>
                <IonItemOptions onIonSwipe={toggleStoneFoundStatus}>
                    <IonItemOption expandable color={stone.isFound ? 'danger' : 'primary'} onClick={toggleStoneFoundStatus}>
                        <IonIcon icon={stone.isFound ? backspaceOutline : checkboxOutline} slot="icon-only"></IonIcon>
                    </IonItemOption>
                </IonItemOptions>
            </IonItemSliding>
            {
                isDetailShown
                 ? (
                    <div className="item-native stoneDetail_wrapper">
                        <div className="stoneDetail_inner">
                            {stoneData.stonePlacementDescription}
                        </div>
                    </div>
                  )
                 : ''
            }
        </div>
    ) : null;
}

export default StoneSummaryEntry;