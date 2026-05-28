importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyB7VR8Dw2YkHTcHK-Cj5iN6sVlPsvNTdgQ",
    authDomain: "shreya-classes.firebaseapp.com",
    projectId: "shreya-classes",
    storageBucket: "shreya-classes.firebasestorage.app",
    messagingSenderId: "567408602716",
    appId: "1:567408602716:web:23f5de196aa8daf8064099",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log("Background Message:", payload);

    self.registration.showNotification(
        payload.notification.title,
        {
            body: payload.notification.body,
            icon: "/logo192.png",
        }
    );
});