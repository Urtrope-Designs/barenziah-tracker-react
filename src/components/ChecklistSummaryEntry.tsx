import React from "react";
import { ChecklistSummary } from "../declarations";
import { IonItem, IonLabel, IonBadge } from "@ionic/react";

interface ChecklistSummaryEntryProps {
    checklistSummary: ChecklistSummary;
    isHighlighted: boolean;
    entryClicked(checklistId: string): any;
}

const ChecklistSummaryEntry: React.FC<ChecklistSummaryEntryProps> = ( {checklistSummary, isHighlighted, entryClicked} ) => {
    return (
        <IonItem onClick={() => {entryClicked(checklistSummary.checklistId)}} color={isHighlighted ? 'primary' : undefined} routerDirection="none">
            <IonLabel>{checklistSummary.checklistName}</IonLabel>
            <IonBadge color="warning" slot="end">{checklistSummary.numStonesToFind}</IonBadge>
        </IonItem>
    )
}

export default ChecklistSummaryEntry;