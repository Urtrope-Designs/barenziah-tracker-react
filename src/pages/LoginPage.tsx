import React from 'react';
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

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
        <div>
            <h1>Please Sign In:</h1>
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
        </div>
    );
};

export default LoginPage;