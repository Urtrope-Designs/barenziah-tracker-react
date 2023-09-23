import { FirebaseApp } from "@firebase/app";
import { Capacitor } from '@capacitor/core';
import { Auth, getAuth, indexedDBLocalPersistence, initializeAuth } from "@firebase/auth";

let auth: Auth;
export function getAppAuth(firebase: FirebaseApp) {
    if (!auth) {
        if (Capacitor.isNativePlatform()) {
            auth = initializeAuth(firebase, { persistence: indexedDBLocalPersistence });
        } else {
            auth = getAuth();
        }
    }
    return auth;
}