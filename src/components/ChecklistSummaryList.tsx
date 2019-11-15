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
} from '@ionic/react';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ChecklistSummary, StoneChecklist } from '../declarations';
import ChecklistSummaryEntry from './ChecklistSummaryEntry';

interface ChecklistSummaryListProps extends RouteComponentProps {
  checklistSummaries: ChecklistSummary[];
  addNewChecklist(checklistName: string, navCallback?: (checklist: StoneChecklist) => any): any;
}

interface ChecklistSummaryListState {
  newChecklistName: string;
}

class ChecklistSummaryList extends React.Component<ChecklistSummaryListProps, ChecklistSummaryListState> {
  constructor(props: ChecklistSummaryListProps) {
    super(props);
    this.state = {
      newChecklistName: ''
    };
  }

  handleNewChecklistNameChange = (event: CustomEvent) => {
    this.setState({newChecklistName: (event.target as HTMLInputElement).value});
  }

  handleNewChecklistInputSave = () => {
    this.props.addNewChecklist(this.state.newChecklistName, (newChecklist: StoneChecklist) => {
      this.setState({newChecklistName: ''});
      this.props.history.push('/checklist/' + newChecklist.checklistId);

    });
  }

  handleNewChecklistInputKeypress = (event: React.KeyboardEvent<HTMLIonInputElement>) => {
    if (event.key === "Enter" && event.target instanceof HTMLInputElement) {
      this.handleNewChecklistInputSave();
      event.target.blur();
    }
  }

  render() {
    return (
      <IonMenu contentId="main" type="overlay">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            {this.props.checklistSummaries.map((checklistSummaryEntry) => {
              return (
                <IonMenuToggle key={checklistSummaryEntry.checklistId} autoHide={false}>
                  <ChecklistSummaryEntry checklistSummary={checklistSummaryEntry} />
                </IonMenuToggle>
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
                <IonButton
                  fill="clear"
                  disabled={this.state.newChecklistName === ''}
                  onClick={this.handleNewChecklistInputSave}
                >Save</IonButton>
              </IonButtons>
            </IonItem>
          </IonList>
        </IonContent>
      </IonMenu>
    )
  }
}

export default withRouter(ChecklistSummaryList);
