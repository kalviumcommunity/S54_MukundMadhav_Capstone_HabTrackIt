import React, { useState, createContext, useContext } from "react";
import { useDisclosure } from "@chakra-ui/react";

const ParentContext = createContext();

export const ContextProvider = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false); // For Navbar
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [user, setUser] = useState(null);
  const value = {
    isSignedIn,
    setIsSignedIn,
    user,
    setUser,
    isLargeScreen,
    setIsLargeScreen,
    isOpen,
    onOpen,
    onClose,
  };

  return (
    <ParentContext.Provider value={value}>{children}</ParentContext.Provider>
  );
};

export const useParentContext = () => {
  return useContext(ParentContext);
};
