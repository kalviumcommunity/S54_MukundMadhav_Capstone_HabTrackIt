import React, { useState, createContext } from "react";

const ParentContext = createContext();

const ContextProvider = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(null);
  const value = {
    isSignedIn,
    setIsSignedIn,
    user,
    setUser,
  };

  return (
    <ParentContext.Provider value={value}>{children}</ParentContext.Provider>
  );
};

export default ContextProvider;
