import { Capacitor } from "@capacitor/core"
import { IonPage, IonButton, IonIcon, IonAlert } from "@ionic/react"
import { skull } from "ionicons/icons";
import { useState } from "react";

interface AboutProps {
    dismissHandler: () => void;
}

export const About: React.FC<AboutProps> = ({dismissHandler}) => {
    const [showDeleteAccountAlert, setShowDeleteAccountAlert] = useState<boolean>(false);

    const deleteUserAccount = () => {};
    
    return (
        <IonPage>
            <div>
              <h1>All about it</h1>
              <p>This app was lovingly crafted by <a href="https://urtropedesigns.com/" target="_blank" rel="noreferrer noopener">Urtrope Designs</a></p>
              {Capacitor.isNativePlatform() 
                  ? <span> If you find it rad or at least mildly useful, please <a href={Capacitor.getPlatform() === "ios" ? "https://apps.apple.com/us/app/barenziah-tracker/id1585514338" : "https://play.google.com/store/apps/details?id=com.urtropedesigns.barenziahtracker"} target="_blank" rel="noreferrer noopener">rate or review it</a>!</span>
                  : ''
              }
              <p>Most of the content in this app was pulled from the "Stones of Barenziah" article on the <a href="https://elderscrolls.fandom.com/wiki/Stones_of_Barenziah" target="_blank" rel="noreferrer noopener">Elder Scrolls Fandom Wiki</a></p>
              <p>As for the email address you used to log in, I'm seriously not going to do anything with it beyond the purposes of handling your log-ins, but you can read the full legalese here in my <a href="https://www.termsfeed.com/live/ae0253cc-690a-43e6-9961-26964c15b6eb" target="_blank" rel="noreferrer noopener">privacy policy</a></p>
              <p>If you want out though, I understand. Here is a self-destruct button to delete your account and all data permanently: <IonButton size="small" color="danger" onClick={() => setShowDeleteAccountAlert(true)}><IonIcon slot="icon-only" icon={skull}></IonIcon></IonButton></p>
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
                        handler: () => deleteUserAccount(),
                    }
                ]}
            />
        </IonPage>
    )
}