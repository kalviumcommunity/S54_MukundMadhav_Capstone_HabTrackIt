import React from "react";
import { VStack, Flex, Image } from "@chakra-ui/react";
import SignupForm from "./SignupForm";

const Signup = () => {
  return (
    <VStack
      minH={["90vh", "100vh", "88.5vh", "88.5vh"]}
      bgGradient="linear(to-br,#1B1745,#233249)"
      textColor={"white"}
      pt={6}
      justifyContent={"center"}
      overflow={"hidden"}
    >
      <Flex flexDir={"column"} alignItems={"center"}>
        <Flex>
          <SignupForm />
        </Flex>
        <Flex
          className="social-link-container"
          justifyContent={["center", "center", "flex-start", "flex-start"]}
          my={4}
          columnGap={4}
        >
          <a
            href="https://www.linkedin.com/in/imukundmadhav/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image src="./LinkedIn.svg" />
          </a>
          <a
            href="https://www.github.com/mukundmadhav054"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image src="./GitHub.svg" />
          </a>
          <a
            href="https://www.instagram.com/mukund__here"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image src="./Instagram.svg" />
          </a>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default Signup;
