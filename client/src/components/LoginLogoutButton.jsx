import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  useDisclosure,
} from "@chakra-ui/react";
import { useAuth } from "../contexts/authContext";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

const LoginLogoutButton = () => {
  const { isLoggedIn, LogOutUser, profilePicture } = useAuth();
  const { onClose } = useDisclosure();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef();
  const menuButtonRef = useRef();

  const handleMenuToggle = () => setIsOpen(!isOpen);

  const handleMenuItemClick = () => setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return isLoggedIn ? (
    <Menu isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <MenuButton
        as={Button}
        rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        colorScheme="white"
        color="white"
        fontWeight="700"
        onClick={handleMenuToggle}
        ref={menuButtonRef}
      >
        <Avatar src={`${profilePicture}`} onClick={handleMenuToggle} />
      </MenuButton>
      <MenuList ref={menuRef}>
        <MenuItem
          onClick={() => {
            navigate("/profile");
            handleMenuItemClick();
          }}
        >
          Profile
        </MenuItem>
        <MenuItem
          onClick={() => {
            LogOutUser();
            navigate("/");
            handleMenuItemClick();
          }}
        >
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
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
