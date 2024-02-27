import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { initializeApp } from 'firebase/app';
import { User, onAuthStateChanged, deleteUser } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router';

import UserChecklistsManager from './components/UserChecklistsManager';
import LoginPage from './pages/LoginPage';
import { getAppAuth } from './util/auth';

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
import { Storage } from '@ionic/storage';
import { StoneChecklist } from './declarations';
import { LocalUserChecklistsManager } from './components/LocalUserChecklistsManager';

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
    getAppAuth(firebaseApp).signOut();
}

const deleteUserAccount = () => {
    const user = getAppAuth(firebaseApp).currentUser;
    if (user) {
        deleteUser(user);
    }
};

// check localstorage for "syncToFirebase" flag
// if true, use existing workflow for firebase
// if false, check localstorage for list data
// if nothing, show welcome page (includes instructions for swiping stones)
//// welcome page has a button to create a new list
//// provide a section for syncing lists - include privacy policy and mention they can choose to sync later in settings
//// also have a section about "hey wait, I have synced lists that I want to keep using"

const BtrApp: React.FC = () => {
    const [syncToFirebase, setSyncToFirebase] = useState<boolean | null | undefined>(undefined);
    const [currentUser, setCurrentUser] = useState<User | null | undefined>(undefined);
    const [checklists, setChecklists] = useState<StoneChecklist[] | null | undefined>(undefined);
    useEffect(() => {
        const store = new Storage();
        store.create()
            .then(() => store.get('syncToFirebase'))
            .then(syncToFirebase => {
                setSyncToFirebase(syncToFirebase === 'true' ? true : false);

                if (syncToFirebase === 'false') {
                    store.get('checklists')
                        .then(checklists => {
                            setChecklists(checklists);
                        });
                }
            });
    }, []);

    useEffect(() => {
        if (syncToFirebase === true) {
            const unregisterAuthObserver = onAuthStateChanged(getAppAuth(firebaseApp), user => {
                setCurrentUser(user);
            })
    
            return unregisterAuthObserver;
        }
    }, [syncToFirebase]);
    
    if (syncToFirebase === true) {
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
                        <Route path="/userchecklists" render={(props) => <UserChecklistsManager {...props} logOutClicked={logOut} deleteUserClicked={deleteUserAccount} firebaseApp={firebaseApp} userId={currentUser.uid} />} />
                    </IonRouterOutlet>
                </IonReactRouter>
            </IonApp>
        )
    } else {
        if (checklists === undefined) {
            return (
                <FullPageLoader message={'Uno Momento'}></FullPageLoader>
            )
        } else if (checklists === null) {
            return (
                <WelcomePage />
            )
        } else {
            return (
                <IonApp>
                    <IonReactRouter>
                        <IonRouterOutlet>
                            <Redirect exact from="/" to="/userchecklists" />
                            <Route path="/userchecklists" render={(props) => <LocalUserChecklistsManager {...props} checklists={checklists} />} />
                        </IonRouterOutlet>
                    </IonReactRouter>
                </IonApp>
            )
        }
    } 
};

export default BtrApp;
