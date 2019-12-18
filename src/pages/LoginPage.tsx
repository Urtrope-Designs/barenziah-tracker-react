import React from 'react';
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol } from '@ionic/react';

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
firebase.initializeApp(firebaseConfig);

const uiConfig: firebaseui.auth.Config = {
    signInFlow: 'popup',
    signInSuccessUrl: '/',
    signInOptions: [
        {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
        }
    ]
}

const LoginPage: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle class="ion-text-center">Barenziah Tracker</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent class="ion-padding">
                <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
            </IonContent>
        </IonPage>
    );
};

export default LoginPage;