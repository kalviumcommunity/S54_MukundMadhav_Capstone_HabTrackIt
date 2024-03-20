import React from "react";
import { Box, Flex, Image, Button, IconButton } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <header>
        <Flex
          className="nav-container"
          bgColor="#141925"
          align="center"
          justifyContent="space-between"
          px="2rem"
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
          <Flex className="link-container">
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
          <Flex align="center">
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
        </Flex>
      </header>
    </>
  );
};

export default Navbar;
