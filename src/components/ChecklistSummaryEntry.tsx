import React from "react";
import { ChecklistSummary } from "../declarations";
import { IonItem, IonLabel, IonBadge } from "@ionic/react";

interface ChecklistSummaryEntryProps {
    checklistSummary: ChecklistSummary;
    entryClicked(checklistId: string): any;
}

const ChecklistSummaryEntry: React.FC<ChecklistSummaryEntryProps> = ( {checklistSummary, entryClicked} ) => {
    return (
        <IonItem onClick={() => {entryClicked(checklistSummary.checklistId)}} routerDirection="none">
            <IonLabel>{checklistSummary.checklistName}</IonLabel>
            <IonBadge color="medium" slot="end">{checklistSummary.numStonesToFind}</IonBadge>
        </IonItem>
    )
}

export default ChecklistSummaryEntry;