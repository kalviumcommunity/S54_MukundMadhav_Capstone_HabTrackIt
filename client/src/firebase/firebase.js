// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1dKlA8e1oQO6YcuAOUl_HL8ShYJn28MU",
  authDomain: "habtrackit.firebaseapp.com",
  projectId: "habtrackit",
  storageBucket: "habtrackit.appspot.com",
  messagingSenderId: "20295302252",
  appId: "1:20295302252:web:34e020609cf452a49cac49"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);