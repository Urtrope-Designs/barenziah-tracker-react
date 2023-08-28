import {
  IonContent,
  IonHeader,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonTitle,
  IonToolbar,
  IonItem,
  IonInput,
  IonButtons,
  IonButton,
  IonIcon,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonAlert,
  IonFooter,
  IonModal,
  IonPage,
} from '@ionic/react';
import { trash, close } from 'ionicons/icons';
import React, { useRef, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ChecklistSummary } from '../declarations';
import ChecklistSummaryEntry from './ChecklistSummaryEntry';
import { MAX_CHARACTER_NAME_LENGTH } from '../util/constants';

import './ChecklistSummaryList.css';

interface ChecklistSummaryListProps extends RouteComponentProps {
  checklistSummaries: ChecklistSummary[];
  activeChecklistId: string;
  addNewChecklist(checklistName: string): any;
  activateChecklist(checklistId: string): any;
  deleteChecklist(checklistId: string): any;
  logOutClicked(): any;
}

interface ChecklistSummaryListState {
  newChecklistName: string;
  requestedDeleteChecklistId: string | null;
  showAboutModal: boolean;
}

const ChecklistSummaryList: React.FC<ChecklistSummaryListProps> = ({
  checklistSummaries, activeChecklistId, addNewChecklist, activateChecklist, deleteChecklist, logOutClicked,
}) => {
  const menuRef = useRef<HTMLIonMenuElement>(null);
  const [newChecklistName, setNewChecklistName] = useState<string>('');
  const [requestedDeleteChecklistId, setRequestedDeleteChecklistId] = useState<string | null>(null);
  const [showAboutModal, setShowAboutModal] = useState<boolean>(false);

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

  const aboutClicked = () => {
    setShowAboutModal(true);
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
        <IonModal isOpen={showAboutModal} class="aboutModal">
          <IonPage>
            <div>
              <h1>All about it</h1>
              <p>This app was lovingly crafted by <a href="https://urtropedesigns.com/" target="_blank" rel="noreferrer noopener">Urtrope Designs</a></p>
              <p>Most of the content in this app was pulled from the "Stones of Barenziah" article on the <a href="https://elderscrolls.fandom.com/wiki/Stones_of_Barenziah" target="_blank" rel="noreferrer noopener">Elder Scrolls Fandom Wiki</a></p>
              <p>As for the email address you used to log in, I'm seriously not going to do anything with it beyond the purposes of handling your log-ins, but you can read the full legalese here in my <a href="https://www.termsfeed.com/live/ae0253cc-690a-43e6-9961-26964c15b6eb" target="_blank" rel="noreferrer noopener">privacy policy</a></p>
            </div>
            <IonButton expand="full" onClick={() => setShowAboutModal(false)}>Cool story bro</IonButton>
          </IonPage>
        </IonModal>
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color="primary" fill='clear' onClick={logOutClicked}>
              Log Out
            </IonButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton color="primary" fill="clear" onClick={aboutClicked}>
              About
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonFooter>
    </IonMenu>
  )
}

export default withRouter(ChecklistSummaryList);
