// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: `${import.meta.env.VITE_APIKEY}`,
  authDomain: `${import.meta.env.VITE_AUTHDOMAIN}`,
  projectId: `${import.meta.env.VITE_PROJECTID}`,
  storageBucket: `${import.meta.env.VITE_STORAGEBUCKET}`,
  messagingSenderId: `${import.meta.env.VITE_MESSAGINGSENDERID}`,
  appId: `${import.meta.env.VITE_APPID}`,
  measurementId: `${import.meta.env.VITE_MEASUREMENTID}`,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const generateToken = async () => {
  const permission = await Notification.requestPermission();
  console.log(permission);
  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey: `${import.meta.env.VITE_VAPIDKEY}`,
    });
    console.log(token);
  }
};
