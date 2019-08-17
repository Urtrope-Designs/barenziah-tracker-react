import React from 'react';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';
import { IonApp, IonPage, IonReactRouter, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { AppPage } from './declarations';

import Menu from './components/Menu';
import List from './pages/List';
import { list } from 'ionicons/icons';
import { store } from './store/store';

/* Core CSS required for Ionic components to work properly */
import '@ionic/core/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/core/css/normalize.css';
import '@ionic/core/css/structure.css';
import '@ionic/core/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/core/css/padding.css';
import '@ionic/core/css/float-elements.css';
import '@ionic/core/css/text-alignment.css';
import '@ionic/core/css/text-transformation.css';
import '@ionic/core/css/flex-utils.css';
import '@ionic/core/css/display.css';

const appPages: AppPage[] = [
  {
    title: 'List',
    url: '/',
    icon: list
  }
];

const BtrApp: React.FunctionComponent = () => (
  <Provider store={store}>
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu appPages={appPages} />
          <IonPage id="main">
            <IonRouterOutlet>
              <Route path="/" component={List} exact={true} />
            </IonRouterOutlet>
          </IonPage>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  </Provider>
);

export default BtrApp;
