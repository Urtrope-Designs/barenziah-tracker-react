import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import FirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import { FirebaseApp } from 'firebase/app';
import { EmailAuthProvider, getAuth } from 'firebase/auth';
import '../theme/firebaseui-styling.global.css';

interface LoginPageProps {
    firebaseApp: FirebaseApp;
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

const LoginPage: React.FC<LoginPageProps> = ({firebaseApp}) => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle class="ion-text-center">Barenziah Tracker</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent class="ion-padding">
                <FirebaseAuth className={'firebaseUi'} uiConfig={uiConfig} firebaseAuth={getAuth(firebaseApp)} />
            </IonContent>
        </IonPage>
    );
};

export default LoginPage;