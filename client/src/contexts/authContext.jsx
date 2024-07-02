import { createContext, useContext, useEffect, useState } from "react";
import {
  auth,
  requestNotificationPermission,
  generateToken,
  onMessageListener,
} from "../firebase/firebase";
import Cookies from "js-cookie";
import axios from "axios";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useToast } from "@chakra-ui/react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [userScore, setUserScore] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      fetchUserData(token);
    } else {
      setLoading(false); // Setting loading to false if no token found
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      setupFCM();
    }
  }, [isLoggedIn]);

  const setupFCM = async () => {
    try {
      const permissionGranted = await requestNotificationPermission();
      if (permissionGranted) {
        const token = await generateToken();
        if (token) {
          await sendTokenToBackend(token);
        }
      }

      onMessageListener()
        .then((payload) => {
          console.log("Received foreground message:", payload);
          toast({
            position: "top",
            title: payload.notification.title,
            description: payload.notification.body,
            variant: "left-accent",
            isClosable: true,
          });
        })
        .catch((err) => console.log("failed: ", err));
    } catch (error) {
      console.error("Error setting up FCM:", error);
    }
  };

  const sendTokenToBackend = async (token) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/save-fcm-token`,
        { newToken: token },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      console.log("FCM token sent to backend:", response.data);
    } catch (error) {
      console.error("Error sending FCM token to backend:", error);
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const { displayName, email, photoURL } = result.user;
      let username = displayName.trim().toLowerCase().replace(/\s+/g, "");
      username += Math.floor(Math.random() * 1000);
      let res = await signUpOrSignIn(email, username, photoURL);
      // console.log("res: ", res);
      return result;
    } catch (error) {
      return error;
    }
  };

  const signUpWithEmailAndPassword = async (email, password, username) => {
    try {
      const result = await signUpOrSignIn(email, username, null, password);
      return result;
    } catch (error) {
      console.error("Error Signing up with Email and Password: ", error);
      return error;
    }
  };

  const signInWithEmailAndPassword = async (email, password) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/login`,
        {
          usernameOrEmail: email,
          password,
        }
      );
      const { token } = response.data;
      Cookies.set("token", token);
      fetchUserData(token);
      return response;
    } catch (error) {
      console.error("Error Signing in with Email and Password: ", error);
      return error;
    }
  };

  const signUpOrSignIn = async (
    email,
    username,
    profilePicture,
    password = null
  ) => {
    try {
      var signupResponse = null;
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/identify-user`,
        {
          usernameOrEmail: email,
        }
      );

      // User exists
      if (response.status === 200) {
        const { token } = response.data;
        Cookies.set("token", token);
        fetchUserData(token);
        return response;
      }

      // User does not exist
      if (response.status === 404) {
        const signupResponse = await axios.post(
          `${import.meta.env.VITE_API_URL}/signup`,
          {
            email,
            username,
            profilePicture,
            password,
          }
        );
        console.log(signupResponse);
        const { token } = signupResponse.data;
        Cookies.set("token", token);
        fetchUserData(token);
        return signupResponse;
      }
    } catch (error) {
      signupResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/signup`,
        {
          email,
          username,
          profilePicture,
          password,
        }
      );

      const { token } = signupResponse.data;
      Cookies.set("token", token);
      fetchUserData(token);
      return signupResponse;
    }
  };

  const fetchUserData = async (token) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/existing-user`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { email, username, profilePicture, userScore } = response.data;
      setEmail(email);
      setUsername(username);
      setProfilePicture(profilePicture);
      setUserScore(userScore);
      setIsLoggedIn(true);
    } catch (error) {
      console.error(`Error fetching user data: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const LogOutUser = () => {
    Cookies.remove("token");
    setEmail("");
    setUsername("");
    setProfilePicture("");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        email,
        username,
        profilePicture,
        userScore,
        setUserScore,
        isLoggedIn,
        loading,
        signInWithGoogle,
        signUpWithEmailAndPassword,
        signInWithEmailAndPassword,
        LogOutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
