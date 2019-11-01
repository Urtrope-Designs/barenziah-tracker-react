import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { AppPage, StoneChecklist, StoneLocation } from './declarations';

import ChecklistSummaryList from './components/ChecklistSummaryList';
import { list } from 'ionicons/icons';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { STONE_LIST } from './util/stone-list';
import ChecklistPageResolver from './pages/ChecklistPageResolver';

const BtrApp: React.FC = () => {

  const appPages: AppPage[] = [
    {
      title: 'List',
      url: '/',
      icon: list
    }
  ];

  const stoneLocations = STONE_LIST;

  const userChecklistsMap: Map<string, StoneChecklist> = new Map([
    [
      '' + (new Date().getTime() - 1000),
      {
        checklistName: 'Theo Seannarson',
        stoneLocations: stoneLocations.map(stone => {
          const stonLoc: StoneLocation = {...stone, isFound: (stone.stoneId % 3 === 0)};
          return stonLoc;
        }),
      },
    ],
    [
      '' + (new Date().getTime() - 500),
      {
        checklistName: 'Aviva Stormbow',
        stoneLocations: stoneLocations.map(stone => {
          const stonLoc: StoneLocation = {...stone, isFound: (stone.stoneId % 5 === 0)};
          return stonLoc;
        }),
      },
    ],
    [
      '' + (new Date().getTime()),
      {
        checklistName: 'Saoirse Shannonsdottir',
        stoneLocations: stoneLocations.map(stone => {
          const stonLoc: StoneLocation = {...stone, isFound: (stone.stoneId === 7 || stone.stoneId === 21)};
          return stonLoc;
        }),
      },
    ]
  ]);

  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <ChecklistSummaryList appPages={appPages} />
          <IonRouterOutlet id="main">
            <Route path="/checklist/:checklistId" render={(props) => <ChecklistPageResolver {...props} userChecklistsMap={userChecklistsMap}/> } exact={true} />
            <Route path="/" render={() => <Redirect to={'/checklist/' + userChecklistsMap.keys().next().value} exact={true} /> } />
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default BtrApp;
