import { auth } from "./firebase";

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  signInWithPopup,
} from "firebase/auth";

export const doCreateUserWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    return error;
  }
};

export const doSignInWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    return error;
  }
};

export const doSignInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    return userCredential;
  } catch (error) {
    return error;
  }
};

export const doSignInWithFacebook = async () => {
  try {
    const provider = new FacebookAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    return userCredential;
  } catch (error) {
    return error;
  }
};

export const doSignOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    return error;
  }
};

export const doPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    return error;
  }
};

export const doPasswordChange = async (password) => {
  try {
    await updatePassword(auth.currentUser, password);
  } catch (error) {
    return error;
  }
};

export const doEmailVerification = async () => {
  try {
    await sendEmailVerification(auth.currentUser, {
      url: `${window.location.origin}/login`,
    });
  } catch (error) {
    return error;
  }
};
