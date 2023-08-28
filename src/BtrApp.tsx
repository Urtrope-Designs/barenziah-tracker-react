import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { initializeApp } from 'firebase/app';
import { User, getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router';

import UserChecklistsManager from './components/UserChecklistsManager';
import LoginPage from './pages/LoginPage';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/display.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';

/* Theme variables */
import FullPageLoader from './components/FullPageLoader';
import './theme/variables.css';

import './BtrApp.css';

setupIonicReact();

const firebaseConfig = {
    apiKey: "AIzaSyDADjVbhrMqC0SV36K5pvrcdQnlJhSrc2I",
    authDomain: "barenziah-tracker.firebaseapp.com",
    databaseURL: "https://barenziah-tracker.firebaseio.com",
    projectId: "barenziah-tracker",
    storageBucket: "barenziah-tracker.appspot.com",
    messagingSenderId: "23343523090",
    appId: "1:23343523090:web:5ec809772a7ed187dd3fcb",
    measurementId: "G-2C0BE53KXX"
};
const firebaseApp = initializeApp(firebaseConfig);

const logOut = () => {
    getAuth(firebaseApp).signOut();
}

const BtrApp: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null | undefined>(undefined);
    useEffect(() => {
        const unregisterAuthObserver = onAuthStateChanged(getAuth(firebaseApp), user => {
            setCurrentUser(user);
        })

        return unregisterAuthObserver;
    });

    return currentUser === undefined ? (
            <FullPageLoader message={'Uno Momento'}></FullPageLoader>
    )
        : currentUser === null ? (
            <LoginPage firebaseApp={firebaseApp} />
        )
        : (
        <IonApp>
            <IonReactRouter>
                <IonRouterOutlet>
                    <Redirect exact from="/" to="/userchecklists" />
                    <Route path="/userchecklists" render={(props) => <UserChecklistsManager {...props} logOutClicked={logOut} firebaseApp={firebaseApp} userId={currentUser.uid} />} />
                </IonRouterOutlet>
            </IonReactRouter>
        </IonApp>
    )
};

export default BtrApp;
