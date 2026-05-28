import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyB7VR8Dw2YkHTcHK-Cj5iN6sVlPsvNTdgQ",
    authDomain: "shreya-classes.firebaseapp.com",
    projectId: "shreya-classes",
    storageBucket: "shreya-classes.firebasestorage.app",
    messagingSenderId: "567408602716",
    appId: "1:567408602716:web:23f5de196aa8daf8064099",
    measurementId: "G-WNBDCSRLPG"
};

const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);

export default app;