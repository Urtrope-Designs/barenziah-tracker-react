import { Capacitor } from '@capacitor/core';
import { IonAlert, IonButton, IonContent, IonFooter, IonHeader, IonPage } from '@ionic/react';
import React from 'react';

import './WelcomePage.css';
interface WelcomePageProps {
    startSyncingClicked?(): any;
    createListClicked?(): any;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({startSyncingClicked, createListClicked}) => {
    const [showSyncAlert, setShowSyncAlert] = React.useState<boolean>(false);
    return (
        <IonPage className="welcomePage">
            <IonHeader>
                <h1>Barenziah Tracker</h1>
            </IonHeader>
            <IonContent className="ion-padding" style={{'--background': 'transparent'}}>
                <div className="welcomeSection">
                    <h3>What is it?</h3>
                    <p>This app will help you hunt down all 24 Stones in the "Unusual Gem" / "No Stone Unturned" questline: simply tap any stone in the list to see the location on the map as well as a screenshot of the stone within the location.</p>
                    <p>As each stone is obtained, simply swipe it left to mark it as found:</p>
                    <img src="/assets/demo/stone-swipe.gif" alt="Swipe a stone to mark it complete."/>
                    <p>There's also a toggle at the bottom of the list that can hide all the stones that you have already found.</p>
                    <p>You can create a new list and switch between existing ones from the hamburger menu, to track multiple characters.</p>
                </div>
                <div className="welcomeSection">
                    <h3>Data/Privacy</h3>
                    <p>By default your lists will just be saved on your current device, but you can click the "Sync Lists" button below to create an account to sync your lists across any number of devices (this option will always be available from the "about" tab on the menu).</p>
                    <div>
                        <IonButton onClick={() => setShowSyncAlert(true)}>Sync Lists in the Cloud</IonButton>
                    </div>
                    <p>Here is my <a href="https://www.termsfeed.com/live/ae0253cc-690a-43e6-9961-26964c15b6eb" target="_blank" rel="noreferrer noopener">privacy policy</a>, which only really applies if you choose to create an account for syncing your list data. If you just click "Get Started" below, the app is entirely self-contained and never sends any data anywhere off of your device.</p>
                </div>
                <div className="welcomeSection">
                    <h3>Credits</h3>
                    <p>This app was lovingly crafted by <a href="https://urtropedesigns.com/" target="_blank" rel="noreferrer noopener">Urtrope Designs</a></p>
                    {Capacitor.isNativePlatform() 
                        ? <span> If you find it rad or at least mildly useful, please <a href={Capacitor.getPlatform() === "ios" ? "https://apps.apple.com/us/app/barenziah-tracker/id1585514338" : "https://play.google.com/store/apps/details?id=com.urtropedesigns.barenziahtracker"} target="_blank" rel="noreferrer noopener">rate or review it</a>!</span>
                        : ''
                    }
                    <p>Most of the content in this app was pulled from the "Stones of Barenziah" article on the <a href="https://elderscrolls.fandom.com/wiki/Stones_of_Barenziah" target="_blank" rel="noreferrer noopener">Elder Scrolls Fandom Wiki</a></p>
                </div>
            </IonContent>
            <IonFooter className="ion-padding">
                <IonButton expand="full" onClick={() => createListClicked && createListClicked()}>Get Started</IonButton>
            </IonFooter>
            <IonAlert
                isOpen={showSyncAlert}
                message={'In order to sync your lists across devices, you will need to create an account using an email address. By doing so you agree to the privacy policy linked above. Are you ready to start syncing?'}
                onDidDismiss={() => {setShowSyncAlert(false)}}
                buttons={[
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        cssClass: 'secondary',
                    },
                    {
                        text: 'Start Syncing',
                        role: 'confirm', 
                        handler: startSyncingClicked,
                    }
                ]}
            />
        </IonPage>
    );
}
