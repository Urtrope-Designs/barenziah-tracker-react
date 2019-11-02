import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import { StoneChecklist } from '../declarations';
import StoneSummaryList from '../components/StoneSummaryList';

interface ChecklistPageProps {
  checklist: StoneChecklist;
  toggleStoneFoundStatus(stoneId: number): any;
}

function hashChecklist(checklist: StoneChecklist): string {
  const hash = checklist.stoneLocations.filter(stonLoc => stonLoc.isFound).map(stonLoc => stonLoc.stoneId).join(',');
  return hash;
}

const ChecklistPage: React.FC<ChecklistPageProps> = ({checklist, toggleStoneFoundStatus}) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{checklist.checklistName}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <StoneSummaryList key={hashChecklist(checklist)} stoneLocations={checklist.stoneLocations} toggleStoneFoundStatus={toggleStoneFoundStatus} />
      </IonContent>
    </IonPage>
  );
};

export default ChecklistPage;
