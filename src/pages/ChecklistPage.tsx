import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonFooter, IonModal } from '@ionic/react';
import React from 'react';
import { StoneChecklist, ImageDetails } from '../declarations';
import StoneSummaryList from '../components/StoneSummaryList';
import { MAX_CHARACTER_NAME_LENGTH } from '../util/constants';

import './ChecklistPage.css';

interface ChecklistPageProps {
  pageElemId?: string;
  checklist: StoneChecklist;
  setStoneFoundStatus(stoneId: number, value: boolean): any;
  updateChecklistName(newChecklistName: string): any;
  toggleHideCompletedStones(): any;
}

interface ChecklistPageState {
  checklistNameEdit: string;
  focusImage: ImageDetails | null;
}

class ChecklistPage extends React.Component<ChecklistPageProps, ChecklistPageState> {
  checklistNameEditSaveButton: React.RefObject<HTMLIonButtonElement>;

  constructor(props: ChecklistPageProps) {
    super(props);
    this.state = {
      checklistNameEdit: props.checklist.checklistName,
      focusImage: null,
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

  handleChecklistNameInputFocusSteal = (event: FocusEvent) => {
    if (event.target === this.checklistNameEditSaveButton.current) {
      document.addEventListener('focusin', this.handleChecklistNameInputFocusSteal, {once: true});
    } else {
      this.setState({checklistNameEdit: this.props.checklist.checklistName});
      document.removeEventListener('click', this.handleChecklistNameInputClickaway)
    }
  }
  handleChecklistNameInputClickaway = (event: MouseEvent) => {
    if (event.target !== this.checklistNameEditSaveButton.current) {
      setTimeout(() => {
        this.setState({checklistNameEdit: this.props.checklist.checklistName});
      }, 20);
      document.removeEventListener('focusin', this.handleChecklistNameInputFocusSteal);
    }
  }

  handleChecklistNameInputBlur = () => {
    document.addEventListener('focusin', this.handleChecklistNameInputFocusSteal, {once: true});
    document.addEventListener('click', this.handleChecklistNameInputClickaway, {once: true});
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

  handleSetFocusImage = (newFocusImage: ImageDetails | null) => {
    this.setState({focusImage: newFocusImage});
  }

  getVisibleStoneLocations = () => {
    if (this.props.checklist.hideCompletedStones) {
      return this.props.checklist.stoneLocations.filter(stonLoc => !stonLoc.isFound);
    } else {
      return this.props.checklist.stoneLocations;
    }
  }

  render() {
    return (
      <IonPage id={this.props.pageElemId}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>
              <IonInput
                spellCheck={false}
                autoCorrect="off"
                maxlength={MAX_CHARACTER_NAME_LENGTH}
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
          <StoneSummaryList
            key={this.props.checklist.checklistId}
            stoneLocations={this.getVisibleStoneLocations()}
            setStoneFoundStatus={this.props.setStoneFoundStatus}
            sortMode={undefined}
            setFocusImage={this.handleSetFocusImage}
          />
          <IonModal isOpen={!!this.state.focusImage} cssClass="focusImageModal">
            <IonPage>
              {this.state.focusImage?.imageTitle &&
                <IonHeader className="ion-no-border">
                  <IonToolbar>
                    <IonTitle className="ion-text-center">{this.state.focusImage?.imageTitle}</IonTitle>
                  </IonToolbar>
                </IonHeader>
              }
              <IonContent>
                <div className="focusImageModal_wrapper">
                  <img src={this.state.focusImage?.imageUrl} alt={this.state.focusImage?.imageAltText} />
                </div>
              </IonContent>
              <IonButton expand="full" onClick={() => this.handleSetFocusImage(null)}>Close</IonButton>
            </IonPage>
          </IonModal>
        </IonContent>
        <IonFooter>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton color="primary" fill={this.props.checklist.hideCompletedStones ? 'solid' : 'clear'} onClick={this.props.toggleHideCompletedStones}>
                {this.props.checklist.hideCompletedStones ? 'Show' : 'Hide'} Completed
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonFooter>
      </IonPage>
    );
  }
};

export default ChecklistPage;
