import {
  IonContent,
  IonHeader,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ChecklistSummary } from '../declarations';
import ChecklistSummaryEntry from './ChecklistSummaryEntry';

interface MenuProps extends RouteComponentProps {
  checklistSummaries: ChecklistSummary[];
}

const ChecklistSummaryList: React.FunctionComponent<MenuProps> = ({ checklistSummaries }) => (
  <IonMenu contentId="main" type="overlay">
    <IonHeader>
      <IonToolbar>
        <IonTitle>Menu</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <IonList>
        {checklistSummaries.map((checklistSummaryEntry) => {
          return (
            <IonMenuToggle key={checklistSummaryEntry.checklistId} autoHide={false}>
              <ChecklistSummaryEntry checklistSummary={checklistSummaryEntry} />
            </IonMenuToggle>
          );
        })}
      </IonList>
    </IonContent>
  </IonMenu>
);

export default withRouter(ChecklistSummaryList);
