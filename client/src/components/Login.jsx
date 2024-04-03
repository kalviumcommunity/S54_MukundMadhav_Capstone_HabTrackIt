import React from "react";
import { Box, VStack, Image, Flex } from "@chakra-ui/react";
import LoginForm from "./LoginForm";

const Login = () => {
  return (
    <Box bgGradient="linear(to-br,#1B1745,#233249)" minH="calc(100vh - 5em)">
      <VStack textColor={"white"} pt={6} justifyContent={"center"}>
        <Flex flexDir={"column"} alignItems={"center"}>
          <Flex className="login-form">
            <LoginForm />
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
              <Image src="./LinkedIn.svg" alt="linkedin logo" />
            </a>
            <a
              href="https://www.github.com/mukundmadhav054"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src="./GitHub.svg" alt="github logo" />
            </a>
            <a
              href="https://www.instagram.com/mukund__here"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src="./Instagram.svg" alt="instagram logo" />
            </a>
          </Flex>
        </Flex>
      </VStack>
    </Box>
  );
};

export default Login;
