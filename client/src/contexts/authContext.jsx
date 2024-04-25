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
      console.log(auth);

      setUsername(uniqueUsername);
      setEmail(auth.currentUser.email);
      setIsUserLoggedIn(true);
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
            Cookies.set("token", check.data.user.token);
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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsUserLoggedIn(true);
      }
    });
    return unsubscribe;
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
      }}
    >
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(authContext);
};
