import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonInput, IonButton } from '@ionic/react';
import React from 'react';
import { StoneChecklist } from '../declarations';
import StoneSummaryList from '../components/StoneSummaryList';

import './ChecklistPage.css';

interface ChecklistPageProps {
  checklist: StoneChecklist;
  toggleStoneFoundStatus(stoneId: number): any;
  updateChecklistName(newChecklistName: string): any;
}

interface ChecklistPageState {
  checklistNameEdit: string;
}

class ChecklistPage extends React.Component<ChecklistPageProps, ChecklistPageState> {
  _checklistBlurToCancelTimeoutId: number | null = null;

  constructor(props: ChecklistPageProps) {
    super(props);
    this.state = {
      checklistNameEdit: props.checklist.checklistName,
    }
  }

  componentDidUpdate(prevProps: ChecklistPageProps) {
    if (this.props.checklist.checklistId !== prevProps.checklist.checklistId) {
      if (!!this._checklistBlurToCancelTimeoutId) {
        window.clearTimeout(this._checklistBlurToCancelTimeoutId);
      }
      this.setState({checklistNameEdit: this.props.checklist.checklistName});
    }
  }

  handleChecklistNameInputChange = (event: CustomEvent) => {
    console.log('name input onIonChange');
    this.setState({checklistNameEdit: (event.target as HTMLInputElement).value});
  }

  handleChecklistNameInputBlur = () => {
    const timeoutId: number = window.setTimeout(() => {
      console.log('timeout finished!');
      this.setState((_state, props) => {
        const fallbackChecklistNameEdit = props.checklist.checklistName;
        return {checklistNameEdit: fallbackChecklistNameEdit};
      })
    }, 200);
    console.log('setting blur timeout: ', timeoutId);
    this._checklistBlurToCancelTimeoutId = timeoutId;
  }

  handleChecklistNameInputSaveClick = () => {
    // is this checking too soon? maybe setstate hasn't completed yet.
    console.log('handle save click, timeoutid: ', this._checklistBlurToCancelTimeoutId);
    if (!!this._checklistBlurToCancelTimeoutId) {
      window.clearTimeout(this._checklistBlurToCancelTimeoutId);
    }
    this.props.updateChecklistName(this.state.checklistNameEdit);
  }

  render() {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>
              <IonInput
                key={this.props.checklist.checklistId}
                value={this.state.checklistNameEdit}
                onIonChange={this.handleChecklistNameInputChange}
                onIonBlur={this.handleChecklistNameInputBlur}
              />
            </IonTitle>
            <IonButtons slot="end">
              <IonButton
                fill="clear"
                disabled={this.state.checklistNameEdit === this.props.checklist.checklistName}
                onClick={this.handleChecklistNameInputSaveClick}
              >Save</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <StoneSummaryList key={this.props.checklist.checklistId} stoneLocations={this.props.checklist.stoneLocations} toggleStoneFoundStatus={this.props.toggleStoneFoundStatus} />
        </IonContent>
      </IonPage>
    );
  }
};

export default ChecklistPage;
