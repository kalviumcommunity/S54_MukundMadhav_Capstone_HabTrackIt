import React, { useLayoutEffect } from "react";
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

  // Using useLayoutEffect to add event listener on component mount and remove on unmount
  useLayoutEffect(() => {
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
          px={["1rem", "2rem"]}
          h="5em"
        >
          <Flex justifyContent={"space-around"} alignItems={"center"}>
            {/* Hamburger menu for small screens */}
            <IconButton
              aria-label="Open Menu"
              size="lg"
              mr={4}
              icon={<HamburgerIcon />}
              display={isLargeScreen ? "none" : "flex"}
              onClick={onOpen}
            />

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
          </Flex>

          {/* Menu items for large screens */}
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
          <Flex align="center">
            <LoginLogoutButton />
          </Flex>
        </Flex>
      </header>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent bgColor={"#141925"} color={"white"}>
            <DrawerCloseButton mt={2} mr={4} size={"lg"} />
            <DrawerBody pt={16}>
              <Flex
                flexDir="column"
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Link to="/signup">
                  <Button
                    variant="ghost"
                    color="white"
                    _hover={{ bg: "white", color: "black" }}
                    aria-label="Get Started"
                    my={2}
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
                    my={2}
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
                    my={2}
                    onClick={onClose}
                  >
                    Write Us
                  </Button>
                </Link>
              </Flex>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
};

export default Navbar;
