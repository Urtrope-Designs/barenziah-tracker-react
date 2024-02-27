import {
  IonAlert,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonModal,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import { close, trash } from 'ionicons/icons';
import React, { useRef, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ChecklistSummary } from '../declarations';
import { MAX_CHARACTER_NAME_LENGTH } from '../util/constants';
import ChecklistSummaryEntry from './ChecklistSummaryEntry';

import { About } from './About';
import './ChecklistSummaryList.css';

interface ChecklistSummaryListProps extends RouteComponentProps {
  checklistSummaries: ChecklistSummary[];
  activeChecklistId: string;
  addNewChecklist(checklistName: string): any;
  activateChecklist(checklistId: string): any;
  deleteChecklist(checklistId: string): any;
  logOutClicked?(): any;
  aboutClicked?(): any;
}

const ChecklistSummaryList: React.FC<ChecklistSummaryListProps> = ({
  checklistSummaries, activeChecklistId, addNewChecklist, activateChecklist, deleteChecklist, logOutClicked, aboutClicked,
}) => {
  const menuRef = useRef<HTMLIonMenuElement>(null);
  const [newChecklistName, setNewChecklistName] = useState<string>('');
  const [requestedDeleteChecklistId, setRequestedDeleteChecklistId] = useState<string | null>(null);

  const handleNewChecklistNameChange = (event: CustomEvent) => {
    setNewChecklistName((event.target as HTMLInputElement).value);
  }

  const handleNewChecklistInputSave = () => {
    addNewChecklist(newChecklistName);
    setNewChecklistName('');
  }

  const handleNewChecklistInputKeypress = (event: React.KeyboardEvent<HTMLIonInputElement>) => {
    if (event.key === "Enter" && event.target instanceof HTMLInputElement) {
      handleNewChecklistInputSave();
      event.target.blur();
      const menu = menuRef.current;
      if (menu) {
        menu.close();
      }
    }
  }

  const confirmDeleteChecklistSummary = (checklistId: string) => {
    setRequestedDeleteChecklistId(checklistId);
  }

  return (
    <IonMenu contentId="main" type="overlay" swipeGesture={false} ref={menuRef}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuToggle>
              <IonButton><IonIcon icon={close} slot="icon-only"></IonIcon></IonButton>
            </IonMenuToggle>
          </IonButtons>
          <IonTitle>Menu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {checklistSummaries.map((checklistSummaryEntry) => {
            return (
              <IonItemSliding key={checklistSummaryEntry.checklistId}>
                <IonMenuToggle autoHide={false}>
                  <ChecklistSummaryEntry
                    checklistSummary={checklistSummaryEntry}
                    isHighlighted={activeChecklistId === checklistSummaryEntry.checklistId}
                    entryClicked={activateChecklist}
                  />
                </IonMenuToggle>
                <IonItemOptions>
                  <IonItemOption color="danger" onClick={() => confirmDeleteChecklistSummary(checklistSummaryEntry.checklistId)}>
                    <IonIcon slot="icon-only" icon={trash}></IonIcon>
                  </IonItemOption>
                </IonItemOptions>
              </IonItemSliding>
            );
          })}
          <IonItem>
            <IonInput
              placeholder="New Character"
              maxlength={MAX_CHARACTER_NAME_LENGTH}
              value={newChecklistName}
              onIonChange={handleNewChecklistNameChange}
              onKeyPress={handleNewChecklistInputKeypress}
            />
            <IonButtons slot="end">
              <IonMenuToggle autoHide={false}>
                <IonButton
                  fill="clear"
                  disabled={newChecklistName === ''}
                  onClick={handleNewChecklistInputSave}
                  >Save</IonButton>
              </IonMenuToggle>
            </IonButtons>
          </IonItem>
        </IonList>
        <IonAlert
          isOpen={requestedDeleteChecklistId != null}
          message={'Are you sure you want to delete this character\'s checklist?'}
          onDidDismiss={() => {setRequestedDeleteChecklistId(null)}}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
            },
            {
              text: 'Delete',
              handler: () => {
                deleteChecklist(requestedDeleteChecklistId || '');
              },
            }
          ]}
        />
      </IonContent>
      <IonFooter>
        <IonToolbar>
          {logOutClicked &&
            <IonButtons slot="start">
              <IonButton color="primary" fill='clear' onClick={logOutClicked}>
                Log Out
              </IonButton>
            </IonButtons>
          }
          {aboutClicked &&
            <IonButtons slot="end">
              <IonButton color="primary" fill="clear" onClick={aboutClicked}>
                About
              </IonButton>
            </IonButtons>
          }
        </IonToolbar>
      </IonFooter>
    </IonMenu>
  )
}

export default withRouter(ChecklistSummaryList);
