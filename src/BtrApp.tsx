import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { initializeApp } from 'firebase/app';
import { User, onAuthStateChanged, deleteUser } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router';

import UserChecklistsManager from './components/UserChecklistsManager';
import LoginPage from './pages/LoginPage';
import { WelcomePage } from './pages/WelcomePage';
import { getAppAuth } from './util/auth';
import FullPageLoader from './components/FullPageLoader';
import { Storage } from '@ionic/storage';
import { StoneChecklist } from './declarations';
import { LocalUserChecklistsManager } from './components/LocalUserChecklistsManager';

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

const firebaseLogOut = () => {
    getAppAuth(firebaseApp).signOut();
}

const deleteUserAccount = () => {
    const user = getAppAuth(firebaseApp).currentUser;
    if (user) {
        deleteUser(user);
    }
};

const updateSyncLists = (doSync: boolean = true) => {
    const store = new Storage();
    store.create()
        .then(() => store.set('syncToFirebase', doSync ? 'true' : 'false'))
        .then(() => window.location.reload());
}

/** Firebase workflow (true)
 * No user: show login page.
 * User: load data and show it.
 */

/** Localstorage workflow (false)
 * No data (INITIAL STATE): show welcome page: intro/instructions (including swiping stones), button at bottom to create new list, sync lists, "I have synced lists" (last two options might be same under the hood)
 * Data: load data and show it.
 */

// other scenarios to consider:
// start syncing with existing data (push existing data to firebase - need to redo list IDs?)
// remove localstorage data
// stop syncing data but don't delete account or data
// delete account or destroy FB data after they have stopped syncing
// always allow migrating FB data to localstorage when deleting FB account or stopping syncing?
// user has fb lists but isn't logged in (need to start syncing, log in, then click "stop syncing" or "delete account")

//  sync  ||  logged in  ||  has fb lists  ||  has local lists

// log out: no transfer of lists (still syncing)
// stop syncing: option to transfer lists to local storage; no deletion of account or data, but log out
// delete account: option to transfer lists to local storage; delete account and all data (if they don't transfer, lists are lost)
// start syncing with existing lists: delete local lists with option to transfer to firebase (if they don't transfer, lists are lost?)
// delete FB account and transfer lists to local, then start syncing again, log into different account with existing lists, then delete account again (if we delete local lists on sync start, not an issue)


const BtrApp: React.FC = () => {
    const [syncToFirebase, setSyncToFirebase] = useState<boolean | null | undefined>(undefined);
    const [currentUser, setCurrentUser] = useState<User | null | undefined>(undefined);

    const [checklistData, setChecklistData] = useState<{checklists: StoneChecklist[] | null | undefined, activeChecklistId: string | null}>({checklists: undefined, activeChecklistId: null});
    useEffect(() => {
        const store = new Storage();
        store.create()
            .then(() => store.get('syncToFirebase'))
            .then(storeSyncValue => {
                setSyncToFirebase(storeSyncValue === 'true' ? true : false);

                if (storeSyncValue !== 'true') {
                    Promise.all([store.get('checklists'), store.get('activeChecklistId')])
                        .then(([checklists, activeChecklistId]) => {
                            setChecklistData({checklists, activeChecklistId});
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

    const initLocalChecklists = () => {
        setChecklistData({checklists: [], activeChecklistId: null});
    }
    
    if (syncToFirebase === true) {
        return currentUser === undefined ? (
                <FullPageLoader message={'Uno Momento'}></FullPageLoader>
        )
            : currentUser === null ? (
                <LoginPage firebaseApp={firebaseApp} cancelSyncingClicked={() => updateSyncLists(false)}/>
            )
            : (
            <IonApp>
                <IonReactRouter>
                    <IonRouterOutlet>
                        <Redirect exact from="/" to="/userchecklists" />
                        <Route path="/userchecklists" render={(props) => <UserChecklistsManager {...props} logOutClicked={firebaseLogOut} deleteUserClicked={deleteUserAccount} firebaseApp={firebaseApp} userId={currentUser.uid} />} />
                    </IonRouterOutlet>
                </IonReactRouter>
            </IonApp>
        )
    } else {
        if (checklistData.checklists === undefined) {
            return (
                <FullPageLoader message={'Uno Momento'}></FullPageLoader>
            )
        } else if (checklistData.checklists === null) {
            return (
                <WelcomePage startSyncingClicked={() => updateSyncLists(true)} createListClicked={initLocalChecklists} />
            )
        } else {
            return (
                <IonApp>
                    <IonReactRouter>
                        <IonRouterOutlet>
                            <Redirect exact from="/" to="/userchecklists" />
                            <Route path="/userchecklists" render={(props) => <LocalUserChecklistsManager {...props} checklists={checklistData.checklists!} activeChecklistId={checklistData.activeChecklistId} />} />
                        </IonRouterOutlet>
                    </IonReactRouter>
                </IonApp>
            )
        }
    } 
};

export default BtrApp;
