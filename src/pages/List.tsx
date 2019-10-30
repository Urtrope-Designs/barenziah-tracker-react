import { IonButtons, IonContent, IonHeader, IonItem, IonList, IonMenuButton, IonTitle, IonToolbar, IonCheckbox, IonLabel, IonInput, IonButton } from '@ionic/react';
import React from 'react';

import { connect } from 'react-redux';
import { STONE_LIST } from '../utils/stone-list';
import { Checklist } from '../store/checklists/types';
import { toggleStoneFoundStatus, updateChecklistName } from '../store/checklists/actions';
import './List.css';

interface PageProps {
  currentChecklist: Checklist;
  onItemClick: Function;
  onUpdateName: Function;
};

interface PageState {
  editValue: string;
}

interface ListProps {
  currentChecklist: Checklist;
  onItemClick: Function;
};

class ListPage extends React.Component<PageProps, PageState> {
  constructor(props: PageProps) {
    super(props);
    this.state = {
      editValue: props.currentChecklist.checklistName,
    };
  }

  handleInputChange = (event: CustomEvent) => {
    this.setState({editValue: (event.target as HTMLInputElement).value})
  }
  handleInputCancel = () => {
    this.setState({
      editValue: this.props.currentChecklist.checklistName,
    });
  }
  handleSaveClick = () => {
    this.props.onUpdateName(this.state.editValue);
  }

  render () {
    return (
      <>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>
              <IonInput
                value={this.state.editValue}
                onIonChange={this.handleInputChange}
              ></IonInput>
            </IonTitle>
            <IonButtons slot="end">
              <IonButton
                fill="clear"
                disabled={this.state.editValue === this.props.currentChecklist.checklistName}
                onClick={this.handleInputCancel}
              >Undo</IonButton>
              <IonButton
                fill="clear"
                disabled={this.state.editValue === this.props.currentChecklist.checklistName}
                onClick={() => {this.handleSaveClick()}}
              >Save</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
    
        <IonContent>
          <ListItems currentChecklist={this.props.currentChecklist} onItemClick={this.props.onItemClick}/>
        </IonContent>
      </>
    );

  }
}

const ListItems: React.FC<ListProps> = ({currentChecklist, onItemClick}) => {
  const items = STONE_LIST.map(stone => {
    return (
      <IonItem key={stone.stoneId}>
        <IonCheckbox 
          slot="start"
          checked={currentChecklist.foundStoneIds.some(i => i === stone.stoneId)}
          onIonChange={() => onItemClick(stone.stoneId)}
        />
        <IonLabel>
          <h2>{stone.locationName}</h2>
          <p className="item-note">
            Hold: {stone.holdName}
          </p>
        </IonLabel>
      </IonItem>
    );
  });

  return <IonList>{items}</IonList>;
};

const mapStateToProps = ((state: {currentChecklist: Checklist}) => {
  return {currentChecklist: state.currentChecklist};
});

const mapDispatchToProps = {
  onItemClick: (stoneId: number) => toggleStoneFoundStatus(stoneId),
  onUpdateName: (newName: string) => updateChecklistName(newName)
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ListPage);
