import { IonButtons, IonContent, IonHeader, IonItem, IonList, IonMenuButton, IonTitle, IonToolbar, IonCheckbox, IonLabel } from '@ionic/react';
import React from 'react';

import { connect } from 'react-redux';
import { STONE_LIST } from '../utils/stone-list';
import { FoundStoneIds } from '../store/checklists/types';
import { toggleStoneFoundStatus } from '../store/checklists/actions';

interface Props {
  foundStoneIds: FoundStoneIds,
  onItemClick: Function
};

const ListPage: React.SFC<Props> = ({foundStoneIds, onItemClick}) => {
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
        <ListItems foundStoneIds={foundStoneIds} onItemClick={(i: number) => onItemClick(i)}/>
      </IonContent>
    </>
  );
};

const ListItems: React.SFC<Props> = ({foundStoneIds, onItemClick}) => {
  const items = STONE_LIST.map(stone => {
    return (
      <IonItem key={stone.stoneId}>
        <IonCheckbox 
          slot="start"
          checked={foundStoneIds.some(i => i === stone.stoneId)}
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

const mapStateToProps = ((state: {foundStoneIds: FoundStoneIds}) => {
  return {foundStoneIds: state.foundStoneIds};
});

const mapDispatchToProps = {
  onItemClick: (stoneId: number) => toggleStoneFoundStatus(stoneId)
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ListPage);
