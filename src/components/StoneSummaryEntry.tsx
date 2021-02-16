import { StoneLocation, StoneLocationData, ImageDetails } from "../declarations";
import { IonItem, IonLabel, IonIcon, IonItemSliding, IonItemOptions, IonItemOption, IonGrid, IonRow, IonCol, } from "@ionic/react";
import React, { useState, useRef } from "react";
import { STONE_LIST } from "../util/stone-list";
import { addOutline, checkboxOutline, backspaceOutline } from "ionicons/icons";

import './StoneSummaryEntry.css';

interface StoneSummaryEntryProps {
    stone: StoneLocation;
    sortMode: 'groupByHold' | undefined;
    setStoneFoundStatus: (stoneId: number, value: boolean) => any;
    setFocusImage: (focusImage: ImageDetails | null) => any;
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
            <h1 className="stoneSummary_locationHeader">{stoneData.locationName}</h1>
            {
                !!stoneData.sublocationName && <h2>{stoneData.sublocationName}</h2>
            }
            <p>
                Hold: {stoneData.holdName}
            </p>
        </React.Fragment>
    );
}

const StoneSummaryEntry: React.FC<StoneSummaryEntryProps> = ({ stone, sortMode, setStoneFoundStatus, setFocusImage }) => {
    const [isDetailShown, setIsDetailShown] = useState(false);
    const [isSettingStoneFound, setIsSettingStoneFound] = useState(false);
    const itemSlidingRef = useRef<HTMLIonItemSlidingElement | null>(null);
    const stoneDetailInnerRef = useRef<HTMLDivElement | null>(null);
    const stoneData = STONE_LIST.find(s => s.stoneId === stone.stoneId);
    const toggleStoneFoundStatus = () => {
        itemSlidingRef.current?.close();
        setIsSettingStoneFound(!stone.isFound);
        setTimeout(() => {
            setStoneFoundStatus(stone.stoneId, !stone.isFound);
        }, stone.isFound ? 0 : 600);
    }
    return !!stoneData ? (
        <div data-is-stone-found={stone.isFound ? true : undefined} data-is-setting-stone-found={isSettingStoneFound ? true : undefined}>
            <IonItemSliding ref={itemSlidingRef}>
                <IonItem
                    color={(stone.isFound || isSettingStoneFound ? 'primary' : undefined)}
                    lines={isDetailShown ? 'none' : 'full'}
                    onClick={(e) => setIsDetailShown(!isDetailShown)}
                >
                    <IonLabel className="stoneSummary_headerLabel">
                        {
                            sortMode === 'groupByHold'
                            ? buildLabelGroupedByHold(stoneData)
                            : buildLabel(stoneData)
                        }
                    </IonLabel>
                    <IonIcon slot="end" icon={addOutline} className={'stoneSummary_showMoreButton' + (isDetailShown ? ' stoneSummary_showMoreButton-detailShown' : '')}/>
                    <div className="stoneSummary_background"></div>
                </IonItem>
                <IonItemOptions onIonSwipe={toggleStoneFoundStatus}>
                    <IonItemOption expandable color={stone.isFound ? 'danger' : 'primary'} onClick={toggleStoneFoundStatus}>
                        <IonIcon icon={stone.isFound ? backspaceOutline : checkboxOutline} slot="icon-only"></IonIcon>
                    </IonItemOption>
                </IonItemOptions>
            </IonItemSliding>
            <div className={`item-native stoneDetail_wrapper${isDetailShown ? ' stoneDetail_wrapper-detailShown' : ''}`} style={{['--stoneDetail-innerHeight' as any]: `${stoneDetailInnerRef.current?.clientHeight}px`}}>
                <div className="stoneDetail_inner" ref={stoneDetailInnerRef}>
                    <IonGrid>
                        <IonRow>
                            {
                                !!stoneData.stonePlacementImageFilename &&
                                <IonCol onClick={() => {
                                        setFocusImage({
                                            imageTitle: stoneData.sublocationName || stoneData.locationName || '',
                                            imageUrl: stoneData.stonePlacementImageFilename ? '/assets/stonePlacement/' + stoneData.stonePlacementImageFilename : '',
                                            imageAltText: stoneData.stonePlacementImageAltText || '',
                                        });
                                    }}>
                                    <img src={'/assets/stonePlacement/' + stoneData.stonePlacementImageFilename} alt={stoneData.stonePlacementImageAltText || 'stone placement image'}/>
                                </IonCol>
                            }
                            {
                                !!stoneData.locationImageFilename &&
                                <IonCol onClick={() => {
                                        setFocusImage({
                                            imageTitle: stoneData.sublocationName || stoneData.locationName || '',
                                            imageUrl: stoneData.locationImageFilename ? '/assets/stoneLocations/' + stoneData.locationImageFilename : '',
                                            imageAltText: stoneData.locationImageAltText || ''
                                        });
                                    }}>
                                    <img src={'/assets/stoneLocations/' + stoneData.locationImageFilename} alt={stoneData.locationImageAltText || 'stone location image'}/>
                                </IonCol>
                            }
                        </IonRow>
                    </IonGrid>
                    {stoneData.stonePlacementDescription}
                </div>
            </div>
        </div>
    ) : null;
}

export default StoneSummaryEntry;