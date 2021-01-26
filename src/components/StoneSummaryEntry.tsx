import { StoneLocation, StoneLocationData } from "../declarations";
import { IonItem, IonLabel, IonIcon, IonItemSliding, IonItemOptions, IonItemOption, } from "@ionic/react";
import React, { useState, useRef } from "react";
import { STONE_LIST } from "../util/stone-list";
import { addOutline, checkboxOutline, backspaceOutline } from "ionicons/icons";

import './StoneSummaryEntry.css';

interface StoneSummaryEntryProps {
    stone: StoneLocation;
    sortMode: 'groupByHold' | undefined;
    setStoneFoundStatus: (stoneId: number, value: boolean) => any;
}

const buildLabelGroupedByHold = (stoneData: StoneLocationData) => {
    return (
        <React.Fragment>
            <h2>{stoneData.locationName}</h2>
            {
                !!stoneData.sublocationName && <p className="item-note">{stoneData.sublocationName}</p>
            }
        </React.Fragment>
    );
}
const buildLabel = (stoneData: StoneLocationData) => {
    return (
        <React.Fragment>
            <h2>{stoneData.locationName}{!!stoneData.sublocationName ? ' - ' + stoneData.sublocationName : ''}</h2>
            <p className="item-note">
                Hold: {stoneData.holdName}
            </p>
        </React.Fragment>
    );
}

const StoneSummaryEntry: React.FC<StoneSummaryEntryProps> = ({ stone, sortMode, setStoneFoundStatus }) => {
    const [isDetailShown, setIsDetailShown] = useState(false);
    const itemSlidingRef = useRef<HTMLIonItemSlidingElement | null>(null);
    const stoneDetailInnerRef = useRef<HTMLDivElement | null>(null);
    const stoneData = STONE_LIST.find(s => s.stoneId === stone.stoneId);
    const toggleStoneFoundStatus = () => {
        setStoneFoundStatus(stone.stoneId, !stone.isFound);
        itemSlidingRef.current?.close()
    }
    return !!stoneData ? (
        <div style={{overflow: 'hidden'}}>
            <IonItemSliding ref={itemSlidingRef}>
                <IonItem color={(stone.isFound ? 'primary' : undefined)} lines={isDetailShown ? 'none' : 'full'} onClick={(e) => setIsDetailShown(!isDetailShown)}>
                    <IonLabel className="stoneSummary_headerLabel">
                        {
                            sortMode === 'groupByHold'
                            ? buildLabelGroupedByHold(stoneData)
                            : buildLabel(stoneData)
                        }
                    </IonLabel>
                    <IonIcon slot="end" icon={addOutline} className={'stoneSummary_showMoreButton' + (isDetailShown ? ' stoneSummary_showMoreButton-detailShown' : '')}/>
                </IonItem>
                <IonItemOptions onIonSwipe={toggleStoneFoundStatus}>
                    <IonItemOption expandable color={stone.isFound ? 'danger' : 'primary'} onClick={toggleStoneFoundStatus}>
                        <IonIcon icon={stone.isFound ? backspaceOutline : checkboxOutline} slot="icon-only"></IonIcon>
                    </IonItemOption>
                </IonItemOptions>
            </IonItemSliding>
            <div className={`item-native stoneDetail_wrapper${isDetailShown ? ' stoneDetail_wrapper-detailShown' : ''}`} style={{['--stoneDetail-innerHeight' as any]: `${stoneDetailInnerRef.current?.clientHeight}px`}}>
                <div className="stoneDetail_inner" ref={stoneDetailInnerRef}>
                    {stoneData.stonePlacementDescription}
                </div>
            </div>
        </div>
    ) : null;
}

export default StoneSummaryEntry;