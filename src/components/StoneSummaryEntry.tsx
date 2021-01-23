import { StoneLocation, StoneLocationData } from "../declarations";
import { IonItem, IonLabel, IonIcon, IonItemSliding, IonItemOptions, IonItemOption, } from "@ionic/react";
import React, { useState, useRef } from "react";
import { STONE_LIST } from "../util/stone-list";
import { addOutline, checkboxOutline, backspaceOutline } from "ionicons/icons";

import './StoneSummaryEntry.css';

export interface toggleShowDetailCallbackContents {
    element: HTMLElement;
    content: HTMLElement;
    shouldOpen: boolean;
    startTransition: () => void;
    endTransition: () => void;
    setOpen: () => void;
    setClosed: () => void;
}

interface StoneSummaryEntryProps {
    stone: StoneLocation;
    sortMode: 'groupByHold' | undefined;
    setStoneFoundStatus: (stoneId: number, value: boolean) => any;
    toggleShowDetail: (contents: toggleShowDetailCallbackContents) => void;
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

const StoneSummaryEntry: React.FC<StoneSummaryEntryProps> = ({ stone, sortMode, setStoneFoundStatus, toggleShowDetail }) => {
    const [isDetailShown, setIsDetailShown] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const itemSlidingRef = useRef<HTMLIonItemSlidingElement | null>(null);
    const hostRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const stoneData = STONE_LIST.find(s => s.stoneId === stone.stoneId);
    const toggleStoneFoundStatus = () => {
        setStoneFoundStatus(stone.stoneId, !stone.isFound);
        itemSlidingRef.current?.close()
    }
    const itemClickHandler = () => {
        if (isTransitioning || !hostRef.current || !contentRef.current) {
            return;
        }
        const shouldOpen = !isDetailShown;
        // setIsDetailShown(shouldOpen);
        // setIsTransitioning(true);

        toggleShowDetail({
            element: hostRef.current,
            content: contentRef.current,
            shouldOpen: shouldOpen,
            startTransition: () => {
                setIsTransitioning(true);
            },
            endTransition: () => {
                setIsTransitioning(false);
            },
            setOpen: () => {
                setIsDetailShown(true);
            },
            setClosed: () => {
                setIsDetailShown(false);
            }
        })
    }
    return !!stoneData ? (
        <div ref={hostRef} className="stoneSummary_root">
            <IonItemSliding ref={itemSlidingRef}>
                <IonItem color={(stone.isFound ? 'primary' : undefined)} lines={isDetailShown ? 'none' : 'full'} onClick={itemClickHandler}>
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
            <div ref={contentRef} className="item-native stoneDetail_wrapper">
                <div className="stoneDetail_inner">
                    {stoneData.stonePlacementDescription}
                </div>
            </div>
        </div>
    ) : null;
}

export default StoneSummaryEntry;