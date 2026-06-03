import {
    getToken,
    onMessage,
    isSupported
} from "firebase/messaging";

import { messaging } from "./firebase";
import axios from "axios";

const VAPID_KEY =
    "BCI63sRf1kGoobvgz5EypNcMo2IRVZPFcZfrbP5DAiTm2z_t9KXnnVR6Hz65IGyfV0peG5FxFH-t3W5tyNdm2GA";

// ─────────────────────────────────────────────
// Request Notification Permission + Save Token
// ─────────────────────────────────────────────
export const requestForToken = async (userId = null) => {

    try {

        // Check browser support
        const supported = await isSupported();

        if (!supported) {

            console.log(
                "Firebase messaging is not supported in this browser"
            );

            return null;
        }

        // Ask notification permission
        const permission =
            await Notification.requestPermission();

        if (permission !== "granted") {

            console.log("Notification permission denied");

            return null;
        }

        // Get FCM Token
        const currentToken = await getToken(
            messaging,
            {
                vapidKey: VAPID_KEY,
            }
        );

        if (currentToken) {

            console.log("FCM Token:", currentToken);

            // Save token to backend DB
            try {

                await axios.post(
                    "https://shreya-classes.onrender.com/api/notifications/save-token",
                    {
                        userId,
                        token: currentToken,
                    }
                );

                console.log("✅ Token saved to database");

            } catch (saveError) {

                console.log(
                    "❌ Error saving token:",
                    saveError
                );
            }

            return currentToken;

        } else {

            console.log(
                "No registration token available"
            );

            return null;
        }

    } catch (err) {

        console.log(
            "❌ Error getting token:",
            err
        );

        return null;
    }
};

// ─────────────────────────────────────────────
// Foreground Notification Listener
// ─────────────────────────────────────────────
export const onMessageListener = () =>
    new Promise((resolve) => {

        onMessage(messaging, (payload) => {

            console.log(
                "📩 Message received:",
                payload
            );

            resolve(payload);
        });
    });