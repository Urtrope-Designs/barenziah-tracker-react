import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import { StoneChecklist } from '../declarations';
import StoneSummaryList from '../components/StoneSummaryList';

interface ChecklistPageProps {
  checklistId: string;
  checklist: StoneChecklist;
}

const ChecklistPage: React.FC<ChecklistPageProps> = ({checklistId, checklist}) => {
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
        <StoneSummaryList stoneLocations={checklist.stoneLocations} />
      </IonContent>
    </IonPage>
  );
};

export default ChecklistPage;
