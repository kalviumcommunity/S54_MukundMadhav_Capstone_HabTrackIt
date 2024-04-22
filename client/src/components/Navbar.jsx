import React, { useEffect } from "react";
import {
  Box,
  Flex,
  Image,
  Button,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import debounce from "lodash/debounce";
import LoginLogoutButton from "./LoginLogoutButton";
import { useParentContext } from "../contexts/parentContext";

const Navbar = () => {
  const { isLargeScreen, setIsLargeScreen, isOpen, onOpen, onClose } =
    useParentContext();

  // Function to handle window resize
  const handleResize = debounce(() => {
    setIsLargeScreen(window.innerWidth > 768);
  }, 100);

  // Using useEffect to add event listener on component mount and remove on unmount
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <header>
        <Flex
          className="nav-container"
          bgColor="#141925"
          align="center"
          justifyContent="space-between"
          px="2rem"
          h="5em"
        >
          <Box className="image-container">
            <Link to="/">
              <Image
                w="170px"
                h="53px"
                src="./HabTrackIt Logo.svg"
                alt="HabTrackIt Logo"
              />
            </Link>
          </Box>
          <Flex
            className="link-container"
            display={isLargeScreen ? "flex" : "none"}
          >
            <Link to="/signup">
              <Button
                variant="ghost"
                color="white"
                _hover={{ bg: "white", color: "black" }}
                aria-label="Get Started"
                my={5}
                w="100%"
              >
                Get Started
              </Button>
            </Link>
            <Link to="/about">
              <Button
                variant="ghost"
                color="white"
                _hover={{ bg: "white", color: "black" }}
                aria-label="About"
                my={5}
                w="100%"
              >
                About
              </Button>
            </Link>
            <Link to="/write-us">
              <Button
                variant="ghost"
                color="white"
                _hover={{ bg: "white", color: "black" }}
                aria-label="Write Us"
                my={5}
                w="100%"
              >
                Write Us
              </Button>
            </Link>
          </Flex>
          <Flex align="center" display={isLargeScreen ? "flex" : "none"}>
            <LoginLogoutButton />
          </Flex>
          <IconButton
            aria-label="Open Menu"
            size="lg"
            mr={2}
            icon={<HamburgerIcon />}
            display={isLargeScreen ? "none" : "flex"}
            onClick={onOpen}
          />
        </Flex>
      </header>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent bgColor={"#141925"} color={"white"}>
            <DrawerCloseButton mt={2} mr={4} size={"lg"} />
            <DrawerBody pt={12}>
              <Flex flexDir="column" align="center">
                <Link to="/signup">
                  <Button
                    variant="ghost"
                    color="white"
                    _hover={{ bg: "white", color: "black" }}
                    aria-label="Get Started"
                    my={5}
                    w="100%"
                    onClick={onClose}
                  >
                    Get Started
                  </Button>
                </Link>
                <Link to="/about">
                  <Button
                    variant="ghost"
                    color="white"
                    _hover={{ bg: "white", color: "black" }}
                    aria-label="About"
                    my={5}
                    w="100%"
                    onClick={onClose}
                  >
                    About
                  </Button>
                </Link>
                <Link to="/write-us">
                  <Button
                    variant="ghost"
                    color="white"
                    _hover={{ bg: "white", color: "black" }}
                    aria-label="Write Us"
                    my={5}
                    w="100%"
                    onClick={onClose}
                  >
                    Write Us
                  </Button>
                </Link>
                <LoginLogoutButton />
              </Flex>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
};

export default Navbar;
