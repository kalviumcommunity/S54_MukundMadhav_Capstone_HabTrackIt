import React from "react";
import { Button } from "@chakra-ui/react";
import { useAuth } from "../contexts/authContext";
import { useParentContext } from "../contexts/parentContext";
import { Link } from "react-router-dom";

const LoginLogoutButton = () => {
  const { isUserLoggedIn, logOut, setIsUserLoggedIn } = useAuth();
  const { onClose } = useParentContext();

  const handleSignOut = async () => {
    try {
      await logOut();
      setIsUserLoggedIn(false);
      window.sessionStorage.removeItem("user");
    } catch (error) {
      console.log(error);
    }
  };

  return isUserLoggedIn ? (
    <Button
      _hover={{ border: "1px solid white" }}
      colorScheme="white"
      color="white"
      bg="#4D5097"
      fontWeight="700"
      onClick={handleSignOut}
    >
      Logout
    </Button>
  ) : (
    <Link to="/login">
      <Button
        _hover={{ border: "1px solid white" }}
        colorScheme="white"
        color="white"
        bg="#4D5097"
        fontWeight="700"
        onClick={onClose}
      >
        Login
      </Button>
    </Link>
  );
};

export default LoginLogoutButton;
