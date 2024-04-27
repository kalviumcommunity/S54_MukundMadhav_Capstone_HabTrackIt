import { useContext, createContext, useState, useLayoutEffect } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase/firebase";
import Cookies from "js-cookie";
import axios from "axios";

const authContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const prevUsername = auth.currentUser.displayName;
      // Generate a unique username
      let uniqueUsername = prevUsername
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ""); // Remove spaces and convert to lowercase
      uniqueUsername += Math.floor(Math.random() * 1000); // Add a random number to make it unique

      setUsername(uniqueUsername);
      setEmail(auth.currentUser.email);
      setProfilePicture(auth.currentUser.photoURL);
      setIsUserLoggedIn(true);
      return userCredential;
    } catch (error) {
      setIsUserLoggedIn(false);
      return error;
    }
  };

  useLayoutEffect(() => {
    const createGoogleUser = async () => {
      try {
        if (username && email) {
          try {
            // Check if the user already exists in the database
            const check = await axios.post(
              `${import.meta.env.VITE_API_URL}/existing-user`,
              {
                usernameOrEmail: email,
              }
            );
            // console.log(check);

            // If user exists, set the user state and token and exit
            setUsername(auth.currentUser.displayName);
            setEmail(auth.currentUser.email);
            setProfilePicture(
              check.data.user.profilePicture === null
                ? auth.currentUser.photoURL
                : check.data.user.profilePicture
            );
            Cookies.set("token", check.data.token);
            setIsUserLoggedIn(true);
            return;
          } catch (error) {
            // User doesn't exist, proceed to create a new user
            console.log("User doesn't exist. Creating a new user.");
          }

          try {
            const res = await axios.post(
              `${import.meta.env.VITE_API_URL}/signup`,
              {
                username,
                email,
              }
            );
            // console.log(res);
            Cookies.set("token", res.data.token);
            setIsUserLoggedIn(true);
          } catch (error) {
            console.log("Error creating user:", error);
          }
        }
      } catch (error) {
        console.log("Error:", error);
      }
    };

    createGoogleUser();
  }, [username, email]);

  const logOut = () => {
    signOut(auth);
  };

  useLayoutEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const email = user.email;
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/existing-user`,
          {
            usernameOrEmail: email,
          }
        );
        // console.log(response);
        if (response.data.user.profilePicture === null) {
          setProfilePicture(user.photoURL);
        } else {
          setProfilePicture(response.data.user.profilePicture);
        }
        setIsUserLoggedIn(true);
      } else {
        setIsUserLoggedIn(false);
        setProfilePicture(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useLayoutEffect(() => {
    const checkData = Cookies.get("token");
    if (checkData) {
      setIsUserLoggedIn(true);
    }
  }, []);

  return (
    <authContext.Provider
      value={{
        signInWithGoogle,
        logOut,
        isUserLoggedIn,
        setIsUserLoggedIn,
        profilePicture,
      }}
    >
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(authContext);
};
