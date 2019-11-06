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
    document.addEventListener('focusin', (event: FocusEvent) => {
      if (event.target !== this.checklistNameEditSaveButton.current) {
        this.setState((_state, props) => {
          const fallbackChecklistNameEdit = props.checklist.checklistName;
          return {checklistNameEdit: fallbackChecklistNameEdit};
        });
      } else {
        document.addEventListener('focusin', () => {
          this.setState({checklistNameEdit: this.props.checklist.checklistName});
        }, {once: true});
      }
    }, {once: true})
  }

  handleChecklistNameInputKeypress = (event: React.KeyboardEvent<HTMLIonInputElement>) => {
    if (event.key === "Enter" && event.target instanceof HTMLInputElement) {
      this.handleChecklistNameInputSave();
      event.target.blur();
    }
  }

  handleChecklistNameInputSave = () => {
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
                spellCheck={false}
                autoCorrect="off"
                key={this.props.checklist.checklistId}
                value={this.state.checklistNameEdit}
                onIonChange={this.handleChecklistNameInputChange}
                onBlur={this.handleChecklistNameInputBlur}
                onKeyPress={this.handleChecklistNameInputKeypress}
              />
            </IonTitle>
            <IonButtons slot="end">
              <IonButton
                ref={this.checklistNameEditSaveButton}
                fill="clear"
                disabled={this.state.checklistNameEdit === this.props.checklist.checklistName}
                onClick={this.handleChecklistNameInputSave}
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
