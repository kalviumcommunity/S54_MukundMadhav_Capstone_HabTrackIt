import {
  useContext,
  createContext,
  useEffect,
  useState,
  useLayoutEffect,
} from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase/firebase";

const authContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [isuser, setisUser] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      setIsUserLoggedIn(true);
      return userCredential;
    } catch (error) {
      setIsUserLoggedIn(false);
      return error;
    }
  };

  const logOut = () => {
    signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        window.sessionStorage.setItem("user", JSON.stringify(user));
        setIsUserLoggedIn(true);
      }
    });
    return unsubscribe;
  }, []);

  useLayoutEffect(() => {
    const checkData = window.sessionStorage.getItem("user");
    if (checkData) {
      setIsUserLoggedIn(true);
    }
  }, []);

  return (
    <authContext.Provider
      value={{
        signInWithGoogle,
        logOut,
        user,
        isUserLoggedIn,
        setIsUserLoggedIn,
        setUser,
        isuser,
        setisUser,
      }}
    >
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(authContext);
};
