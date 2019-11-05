import React from "react";
import { ChecklistSummary } from "../declarations";
import { IonItem, IonLabel, IonBadge } from "@ionic/react";

interface ChecklistSummaryEntryProps {
    checklistSummary: ChecklistSummary;
}

const ChecklistSummaryEntry: React.FC<ChecklistSummaryEntryProps> = ( {checklistSummary} ) => {
    return (
        <IonItem routerLink={'/checklist/' + checklistSummary.checklistId} routerDirection="none">
            <IonLabel>{checklistSummary.checklistName}</IonLabel>
            <IonBadge color="medium" slot="end">{checklistSummary.numStonesToFind}</IonBadge>
        </IonItem>
    )
}

export default ChecklistSummaryEntry;