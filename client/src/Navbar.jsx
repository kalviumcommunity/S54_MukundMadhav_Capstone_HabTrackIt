import React, { useState } from "react";
import { Box, Flex, Image, Button, IconButton } from "@chakra-ui/react";
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [displayMenu, setDisplayMenu] = useState("none");
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
            display={["none", "none", "flex", "flex"]}
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
          <Flex align="center" display={["none", "none", "flex", "flex"]}>
            <Button
              _hover={{ border: "1px solid white" }}
              colorScheme="white"
              color="white"
              bg="#4D5097"
              fontWeight="700"
            >
              Login
            </Button>
          </Flex>
          <IconButton
            aria-label="Open Menu"
            size="lg"
            mr={2}
            icon={<HamburgerIcon />}
            display={["flex", "flex", "none", "none"]}
            onClick={() => setDisplayMenu("flex")}
          />
          <Flex
            w="100vw"
            zIndex={20}
            h="100vh"
            bgColor="#141925"
            pos="fixed"
            top="0"
            left="0"
            overflowY="auto"
            flexDir="column"
            display={displayMenu}
          >
            <Flex justify="flex-end">
              <IconButton
                mt={4}
                mr={10}
                aria-label="Close Menu"
                size="lg"
                icon={<CloseIcon />}
                onClick={() => setDisplayMenu("none")}
              />
            </Flex>
            <Flex flexDir="column" align="center">
              <Link to="/">
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
          </Flex>
        </Flex>
      </header>
    </>
  );
};

export default Navbar;
