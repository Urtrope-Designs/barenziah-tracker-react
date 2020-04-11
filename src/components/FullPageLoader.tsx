import React from "react";
import { IonApp, IonGrid, IonRow, IonCol, IonSpinner } from "@ionic/react";

interface FullPageLoaderProps {
    message: string;
}

const FullPageLoader: React.FC<FullPageLoaderProps> = ({message}) => {
    return (
        <IonApp>
            <IonGrid>
                <IonRow class="ion-align-items-center ion-justify-content-center" style={{height: '100%'}}>
                    <IonCol style={{textAlign: 'center'}}>
                        {message}
                        <br />
                        <IonSpinner name="dots"/>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonApp>
    );
}

export default FullPageLoader;