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
  checklistNameEditSaveButton: React.RefObject<HTMLIonButtonElement>;

  constructor(props: ChecklistPageProps) {
    super(props);
    this.state = {
      checklistNameEdit: props.checklist.checklistName,
    }

    this.checklistNameEditSaveButton = React.createRef();
  }

  componentDidUpdate(prevProps: ChecklistPageProps) {
    if (this.props.checklist.checklistId !== prevProps.checklist.checklistId) {
      this.setState({checklistNameEdit: this.props.checklist.checklistName});
    }
  }

  handleChecklistNameInputChange = (event: CustomEvent) => {
    this.setState({checklistNameEdit: (event.target as HTMLInputElement).value});
  }

  handleChecklistNameInputBlur = () => {
    document.addEventListener('click', (event: MouseEvent) => {
      if (event.target === this.checklistNameEditSaveButton.current) {
        this.props.updateChecklistName(this.state.checklistNameEdit);
      } else {
        this.setState((_state, props) => {
          const fallbackChecklistNameEdit = props.checklist.checklistName;
          return {checklistNameEdit: fallbackChecklistNameEdit};
        });
      }
    }, {once: true})
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
                ref={this.checklistNameEditSaveButton}
                fill="clear"
                disabled={this.state.checklistNameEdit === this.props.checklist.checklistName}
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
