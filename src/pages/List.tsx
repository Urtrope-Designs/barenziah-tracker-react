import { IonButtons, IonContent, IonHeader, IonItem, IonList, IonMenuButton, IonTitle, IonToolbar, IonCheckbox, IonLabel } from '@ionic/react';
import React from 'react';

import { STONE_LIST } from '../utils/stone-list';

const ListPage: React.FunctionComponent = () => {
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
        <ListItems />
      </IonContent>
    </>
  );
};

const ListItems = () => {
  const items = STONE_LIST.map(stone => {
    return (
      <IonItem key={stone.stoneId}>
        <IonCheckbox slot="start" />
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

export default ListPage;
