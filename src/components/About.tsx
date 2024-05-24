import { Capacitor } from "@capacitor/core";
import { IonAlert, IonButton, IonIcon, IonPage } from "@ionic/react";
import { skull } from "ionicons/icons";
import { useState } from "react";


// branch content based on syncToFirebase flag
//// if true, include buttons to log out, stop syncing, and delete account
//// if false, include button/explanation to start syncing
// either way show privacy policy

interface AboutProps {
    dismissHandler: () => void;
    deleteUserClicked?(): any;
    startSyncingClicked?(): any;
}

export const About: React.FC<AboutProps> = ({dismissHandler, deleteUserClicked, startSyncingClicked}) => {
    const [showDeleteAccountAlert, setShowDeleteAccountAlert] = useState<boolean>(false);
    const [showStartSyncingAlert, setShowStartSyncingAlert] = useState<boolean>(false);
    const privacyPolicyDisclaimer = <p>As for the email address you use to log in, I'm seriously not going to do anything with it beyond the purposes of handling your log-ins, but you can read the full legalese here in my <a href="https://www.termsfeed.com/live/ae0253cc-690a-43e6-9961-26964c15b6eb" target="_blank" rel="noreferrer noopener">privacy policy</a></p>;

    return (
        <IonPage className="ion-padding">
            <div>
              <h1>All about it</h1>
              <p>This app was lovingly crafted by <a href="https://urtropedesigns.com/" target="_blank" rel="noreferrer noopener">Urtrope Designs</a></p>
              {Capacitor.isNativePlatform() 
                  ? <span> If you find it rad or at least mildly useful, please <a href={Capacitor.getPlatform() === "ios" ? "https://apps.apple.com/us/app/barenziah-tracker/id1585514338" : "https://play.google.com/store/apps/details?id=com.urtropedesigns.barenziahtracker"} target="_blank" rel="noreferrer noopener">rate or review it</a>!</span>
                  : ''
              }
              <p>Most of the content in this app was pulled from the "Stones of Barenziah" article on the <a href="https://elderscrolls.fandom.com/wiki/Stones_of_Barenziah" target="_blank" rel="noreferrer noopener">Elder Scrolls Fandom Wiki</a></p>
              {deleteUserClicked
                ? <>
                    {privacyPolicyDisclaimer}
                    <p>If you want out though, I understand. Here is a self-destruct button to delete your account and all data permanently: <IonButton size="small" color="danger" onClick={() => setShowDeleteAccountAlert(true)}><IonIcon slot="icon-only" icon={skull}></IonIcon></IonButton></p>
                </>
                : <>
                    <p>Currently all of your data is safe on your local device. If you'd like to be able to share lists between multiple devices though, click the "start syncing" button below to switch to using a cloud account, which will require you to create a password.</p>
                    <p>For now you'll have to create all new lists if you switch to the cloud (transferring data will be part of an upcoming release of the app).</p>
                    {/* <p>Currently all of your data is safe on your local device. If you don't mind shoving it into the cloud, click the "Start Syncing" button below and create an account that you can use on any device with this app installed to share your data in real time.</p> */}
                    {privacyPolicyDisclaimer}
                    <IonButton size="small" color="primary" onClick={() => setShowStartSyncingAlert(true)}>Start Syncing</IonButton>
                </>
              }
            </div>
            <IonButton expand="full" onClick={() => dismissHandler()}>Cool story bro</IonButton>
            <IonAlert
                isOpen={showDeleteAccountAlert}
                message={'Are you sure you want to delete your account and all data? This action cannot be undone.'}
                onDidDismiss={() => {setShowDeleteAccountAlert(false)}}
                buttons={[
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        cssClass: 'secondary',
                    },
                    {
                        text: 'Yes, burn it.',
                        role: 'destructive', 
                        handler: deleteUserClicked,
                    }
                ]}
            />
            <IonAlert
                isOpen={showStartSyncingAlert}
                // message={'Are you sure you want to move your lists to the cloud? Your data will be deleted from your local device and copied to the cloud account you set up.'}
                message = 'Are you sure you want to switch to using a cloud account? Your data will not transfer, but you can always switch back by clicking "Use Local Data" on the login screen.'
                onDidDismiss={() => {setShowStartSyncingAlert(false)}}
                buttons={[
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        cssClass: 'secondary',
                    },
                    {
                        text: 'Yes, sync my data already!',
                        role: 'confirm', 
                        handler: startSyncingClicked,
                    }
                ]}
            />
        </IonPage>
    )
}