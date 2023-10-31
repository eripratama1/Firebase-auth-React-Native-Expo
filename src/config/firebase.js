import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { initializeAuth, getReactNativePersistence } from "firebase/auth"
import ReactNativeAsyncStorage  from "@react-native-async-storage/async-storage";

const firebaseConfig = {
    apiKey: "AIzaSyB754uO4N_W5x03Hnr8lFs1TgeU2NkUCaw",
    authDomain: "rne-auth-firebase.firebaseapp.com",
    projectId: "rne-auth-firebase",
    storageBucket: "rne-auth-firebase.appspot.com",
    messagingSenderId: "789023374361",
    appId: "1:789023374361:web:8c0150461306a7be30fe88"
};

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app)
export const storage = getStorage(app)
export const firebaseAuth = initializeAuth(app, {
    persistence:getReactNativePersistence(ReactNativeAsyncStorage)
})