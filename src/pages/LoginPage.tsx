import { IonButton, IonContent, IonFooter, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import FirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import { FirebaseApp } from 'firebase/app';
import { EmailAuthProvider } from 'firebase/auth';
import '../theme/firebaseui-styling.global.css';
import { getAppAuth } from '../util/auth';

interface LoginPageProps {
    firebaseApp: FirebaseApp;
    cancelSyncingClicked(): any;
}

const uiConfig: firebaseui.auth.Config = {
    signInFlow: 'popup',
    callbacks: {
        signInSuccessWithAuthResult: () => false,
    },
    signInOptions: [
        {
            provider: EmailAuthProvider.PROVIDER_ID,
            requireDisplayName: false,
        },
    ],
    credentialHelper: 'none',
    privacyPolicyUrl: 'https://www.termsfeed.com/live/ae0253cc-690a-43e6-9961-26964c15b6eb',
    tosUrl: 'https://www.termsfeed.com/live/9ffc9d1f-0e53-4431-b2d5-a100b15a9f29',
}

const LoginPage: React.FC<LoginPageProps> = ({firebaseApp, cancelSyncingClicked}) => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle class="ion-text-center">Barenziah Tracker</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent class="ion-padding">
                <FirebaseAuth className={'firebaseUi'} uiConfig={uiConfig} firebaseAuth={getAppAuth(firebaseApp)} />
            </IonContent>
            <IonFooter class="ion-padding">
                <IonButton expand="full" onClick={cancelSyncingClicked}>Use Local Data</IonButton>
            </IonFooter>
        </IonPage>
    );
};

export default LoginPage;