import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonInput, IonButton } from '@ionic/react';
import React from 'react';
import { StoneChecklist } from '../declarations';
import StoneSummaryList from '../components/StoneSummaryList';

interface ChecklistPageProps {
  checklist: StoneChecklist;
  toggleStoneFoundStatus(stoneId: number): any;
  updateChecklistName(newChecklistName: string): any;
}

interface ChecklistPageState {
  checklistNameEdit: string;
  checklistBlurToCancelTimeoutId: number | null; 
}

class ChecklistPage extends React.Component<ChecklistPageProps, ChecklistPageState> {
  constructor(props: ChecklistPageProps) {
    super(props);
    this.state = {
      checklistNameEdit: props.checklist.checklistName,
      checklistBlurToCancelTimeoutId: null,
    }
  }

  handleChecklistNameInputChange = (event: CustomEvent) => {
    this.setState({checklistNameEdit: (event.target as HTMLInputElement).value});
  }

  handleChecklistNameInputBlur = () => {
    const timeoutId: number = window.setTimeout(() => {
      this.setState((_state, props) => {
        const fallbackChecklistNameEdit = props.checklist.checklistName;
        return {checklistNameEdit: fallbackChecklistNameEdit};
      })
    }, 30);
    this.setState({checklistBlurToCancelTimeoutId: timeoutId});
  }

  handleChecklistNameInputSaveClick = () => {
    if (!!this.state.checklistBlurToCancelTimeoutId) {
      window.clearTimeout(this.state.checklistBlurToCancelTimeoutId);
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
                value={this.state.checklistNameEdit}
                onIonChange={this.handleChecklistNameInputChange}
                onIonBlur={this.handleChecklistNameInputBlur}
              />
            </IonTitle>
            <IonButtons slot="end">
              <IonButton
                fill="clear"
                disabled={this.state.checklistNameEdit === this.props.checklist.checklistName}
                onClick={() => {this.handleChecklistNameInputSaveClick()}}
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
