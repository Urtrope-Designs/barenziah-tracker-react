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
} from '@ionic/react';
import { trash, close } from 'ionicons/icons';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ChecklistSummary } from '../declarations';
import ChecklistSummaryEntry from './ChecklistSummaryEntry';

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
}

class ChecklistSummaryList extends React.Component<ChecklistSummaryListProps, ChecklistSummaryListState> {
  private menuRef = React.createRef<HTMLIonMenuElement>();

  constructor(props: ChecklistSummaryListProps) {
    super(props);
    this.state = {
      newChecklistName: '',
      requestedDeleteChecklistId: null,
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
        </IonContent>
        <IonFooter>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton color="primary" fill='clear' onClick={this.props.logOutClicked}>
                Log Out
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonFooter>
      </IonMenu>
    )
  }
}

export default withRouter(ChecklistSummaryList);
