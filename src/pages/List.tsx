import { IonButtons, IonContent, IonHeader, IonItem, IonList, IonMenuButton, IonTitle, IonToolbar, IonCheckbox, IonLabel } from '@ionic/react';
import React from 'react';

import { connect } from 'react-redux';
import { STONE_LIST } from '../utils/stone-list';
import { Checklist } from '../store/checklists/types';
import { toggleStoneFoundStatus, updateChecklistName } from '../store/checklists/actions';

interface Props {
  currentChecklist: Checklist,
  onItemClick: Function
};

const ListPage: React.SFC<Props> = ({currentChecklist, onItemClick}) => {
  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Stone Locations</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <ListItems currentChecklist={currentChecklist} onItemClick={(i: number) => onItemClick(i)}/>
      </IonContent>
    </>
  );
};

const ListItems: React.SFC<Props> = ({currentChecklist, onItemClick}) => {
  const items = STONE_LIST.map(stone => {
    return (
      <IonItem key={stone.stoneId}>
        <IonCheckbox 
          slot="start"
          checked={currentChecklist.foundStoneIds.some(i => i === stone.stoneId)}
          onIonChange={(e: CustomEvent) => onItemClick(stone.stoneId)}
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
