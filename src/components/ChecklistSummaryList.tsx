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
import React from 'react';
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

class ChecklistSummaryList extends React.Component<ChecklistSummaryListProps, ChecklistSummaryListState> {
  private menuRef = React.createRef<HTMLIonMenuElement>();

  constructor(props: ChecklistSummaryListProps) {
    super(props);
    this.state = {
      newChecklistName: '',
      requestedDeleteChecklistId: null,
      showAboutModal: false,
    };
  }

  handleNewChecklistNameChange = (event: CustomEvent) => {
    this.setState({newChecklistName: (event.target as HTMLInputElement).value});
  }

  handleNewChecklistInputSave = () => {
    this.props.addNewChecklist(this.state.newChecklistName);
    this.setState({newChecklistName: ''});
  }

  handleNewChecklistInputKeypress = (event: React.KeyboardEvent<HTMLIonInputElement>) => {
    if (event.key === "Enter" && event.target instanceof HTMLInputElement) {
      this.handleNewChecklistInputSave();
      event.target.blur();
      const menu = this.menuRef.current;
      if (!!menu) {
        menu.close();
      }
    }
  }

  confirmDeleteChecklistSummary = (checklistId: string) => {
    this.setState({requestedDeleteChecklistId: checklistId});
  }

  aboutClicked = () => {
    this.setState({showAboutModal: true});
  }

  render() {
    return (
      <IonMenu contentId="main" type="overlay" swipeGesture={false} ref={this.menuRef}>
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
            {this.props.checklistSummaries.map((checklistSummaryEntry) => {
              return (
                <IonItemSliding key={checklistSummaryEntry.checklistId}>
                  <IonMenuToggle autoHide={false}>
                    <ChecklistSummaryEntry
                      checklistSummary={checklistSummaryEntry}
                      isHighlighted={this.props.activeChecklistId === checklistSummaryEntry.checklistId}
                      entryClicked={this.props.activateChecklist}
                    />
                  </IonMenuToggle>
                  <IonItemOptions>
                    <IonItemOption color="danger" onClick={() => this.confirmDeleteChecklistSummary(checklistSummaryEntry.checklistId)}>
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
                value={this.state.newChecklistName}
                onIonChange={this.handleNewChecklistNameChange}
                onKeyPress={this.handleNewChecklistInputKeypress}
              />
              <IonButtons slot="end">
                <IonMenuToggle autoHide={false}>
                  <IonButton
                    fill="clear"
                    disabled={this.state.newChecklistName === ''}
                    onClick={this.handleNewChecklistInputSave}
                    >Save</IonButton>
                </IonMenuToggle>
              </IonButtons>
            </IonItem>
          </IonList>
          <IonAlert
            isOpen={this.state.requestedDeleteChecklistId != null}
            message={'Are you sure you want to delete this character\'s checklist?'}
            onDidDismiss={() => {this.setState({requestedDeleteChecklistId: null})}}
            buttons={[
              {
                text: 'Cancel',
                role: 'cancel',
                cssClass: 'secondary',
              },
              {
                text: 'Delete',
                handler: () => {
                  this.props.deleteChecklist(this.state.requestedDeleteChecklistId || '');
                },
              }
            ]}
          />
          <IonModal isOpen={this.state.showAboutModal} cssClass="aboutModal">
            <IonPage>
              <div>
                <h1>All about it</h1>
                <p>This app was lovingly crafted by <a href="https://urtropedesigns.com/" target="_blank" rel="noreferrer noopener">Urtrope Designs</a></p>
                <p>Most of the content in this app was pulled from the "Stones of Barenziah" article on the <a href="https://elderscrolls.fandom.com/wiki/Stones_of_Barenziah" target="_blank" rel="noreferrer noopener">Elder Scrolls Fandom Wiki</a></p>
                <p>As for the email address you used to log in, I'm seriously not going to do anything with it beyond the purposes of handling your log-ins, but you can read the full legalese here in my </p>
              </div>
              <IonButton expand="full" onClick={() => this.setState({showAboutModal: false})}>Cool story bro</IonButton>
            </IonPage>
          </IonModal>
        </IonContent>
        <IonFooter>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton color="primary" fill='clear' onClick={this.props.logOutClicked}>
                Log Out
              </IonButton>
            </IonButtons>
            <IonButtons slot="end">
              <IonButton color="primary" fill="clear" onClick={this.aboutClicked}>
                About
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonFooter>
      </IonMenu>
    )
  }
}

export default withRouter(ChecklistSummaryList);
