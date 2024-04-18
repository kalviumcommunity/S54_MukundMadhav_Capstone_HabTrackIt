import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import {
  Flex,
  Stack,
  Heading,
  Text,
  Container,
  Input,
  Button,
  SimpleGrid,
  InputGroup,
  InputRightElement,
  FormControl,
  FormLabel,
  Divider,
  HStack,
  AbsoluteCenter,
  Box,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useAuth } from "../contexts/authContext";
import { FcGoogle } from "react-icons/fc";

export default function LoginForm() {
  const { signInWithGoogle } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.log(error);
    }
  };

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    watch,
  } = useForm({ mode: "onChange" });
  const [showPassword, setShowPassword] = useState(false);
  const password = useRef({});
  password.current = watch("password", "");

  const handleShowClick = () => setShowPassword(!showPassword);

  const onSubmit = (values) => {
    console.log(values);
  };

  return (
    <Flex align={"center"} justify={"center"}>
      <Container
        w={["80vw", "45vw", "28vw", "26vw"]}
        boxShadow={"xl"}
        rounded={"2xl"}
        p={6}
        bgGradient="linear(to-br, #326BA0, #063882)"
        className="login-container"
      >
        <Stack spacing={2} alignItems={"center"}>
          <Heading color="white" as={"h2"} size={"md"} mb={4}>
            Login To Your Account
          </Heading>
          <Flex rounded={"lg"} flexDir={"column"} w="100%">
            <form onSubmit={handleSubmit(onSubmit)}>
              <SimpleGrid columns={1} spacingY={3} justifyContent={"center"}>
                <FormControl id="usernameOrEmail">
                  <FormLabel>Username or Email</FormLabel>
                  <Input
                    placeholder="Enter your Username or Email"
                    bg={"rgba(34, 50, 73, 0.65)"}
                    border={"none"}
                    w="100%"
                    {...register("usernameOrEmail", {
                      required: "This field is required",
                      minLength: {
                        value: 3,
                        message: "Input must be at least 3 characters long",
                      },
                    })}
                  />
                  {errors.usernameOrEmail && (
                    <Text color="red.500">
                      {errors.usernameOrEmail.message}
                    </Text>
                  )}
                </FormControl>

                <FormControl id="password">
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      bg={"rgba(34, 50, 73, 0.65)"}
                      border={"none"}
                      w="100%"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message:
                            "Password must be at least 8 characters long",
                        },
                        pattern: {
                          value:
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
                          message:
                            "Password must contain at least 1 uppercase, 1 lowercase, 1 numeric, and 1 special character.",
                        },
                      })}
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={handleShowClick}
                        bg={"transparent"}
                        _hover={{ bg: "none" }}
                      >
                        {showPassword ? (
                          <ViewOffIcon color={"white"} />
                        ) : (
                          <ViewIcon color={"white"} />
                        )}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  {errors.password && (
                    <Text color="red.500">{errors.password.message}</Text>
                  )}
                </FormControl>

                <Button
                  color={"white"}
                  type="submit"
                  maxW={"fit-content"}
                  justifySelf={"center"}
                  disabled={!isValid}
                  fontWeight={"bold"}
                  fontSize={"3vh"}
                  variant={"solid"}
                  _hover={{ bgColor: "#2985DC" }}
                  bgColor={"#316AA0"}
                >
                  Log In
                </Button>
              </SimpleGrid>
            </form>
            <Box position="relative" p={2}>
              <Divider
                my={[4, 4, 2, 2]}
                borderColor={"#314664"}
                borderBottomWidth={"2px"}
                w={"90%"}
                alignSelf={"center"}
              />
              <AbsoluteCenter px="4">Or</AbsoluteCenter>
            </Box>
            <Flex align={"center"} flexDir={"column"}>
              <Flex
                className="3rd-party-authentication-container"
                mt={"10px"}
                mb={2}
                columnGap={10}
              >
                <HStack
                  p={2}
                  borderRadius={10}
                  cursor={"pointer"}
                  onClick={handleGoogleSignIn}
                  _hover={{ backgroundColor: "#2C2C2C" }}
                >
                  <FcGoogle size={"2rem"} />
                  <Text>Login with Google</Text>
                </HStack>
              </Flex>
              <Text>
                Don't have an account ? <Link to={"/signup"}>Sign Up</Link>
              </Text>
            </Flex>
          </Flex>
        </Stack>
      </Container>
    </Flex>
  );
}
