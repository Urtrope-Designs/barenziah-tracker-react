import React from 'react';
import firebase from 'firebase/app';
import FirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react';

import '../theme/firebaseui-styling.global.css';

interface LoginPageProps {
    firebaseApp: firebase.app.App;
}

const uiConfig: firebaseui.auth.Config = {
    signInFlow: 'popup',
    signInSuccessUrl: '/',
    signInOptions: [
        {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            requireDisplayName: false,
        },
    ],
    credentialHelper: 'none',
}

const LoginPage: React.FC<LoginPageProps> = ({firebaseApp}) => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle class="ion-text-center">Barenziah Tracker</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent class="ion-padding">
                <FirebaseAuth className={'firebaseUi'} uiConfig={uiConfig} firebaseAuth={firebaseApp.auth()} />
            </IonContent>
        </IonPage>
    );
};

export default LoginPage;