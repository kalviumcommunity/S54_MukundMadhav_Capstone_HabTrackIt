import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
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

export default function SignupForm() {
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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const password = useRef({});
  password.current = watch("password", "");

  const handleShowClick1 = () => setShowPassword(!showPassword);
  const handleShowClick2 = () => setShowConfirmPassword(!showConfirmPassword);

  const onSubmit = (values) => {
    console.log(values);
  };

  return (
    <Flex align={"flex-start"} justify={"center"}>
      <Container
        w={["80vw", "45vw", "28vw", "26vw"]}
        boxShadow={"xl"}
        rounded={"2xl"}
        p={6}
        bgGradient="linear(to-br, #326BA0, #063882)"
        className="signup-container"
      >
        <Stack spacing={2} alignItems={"center"}>
          <Heading color="white" as={"h2"} size={"lg"} mb={4}>
            Sign Up For Free
          </Heading>
          <Flex rounded={"lg"} minW={"20vw"} flexDir={"column"} w={"100%"}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <SimpleGrid columns={1} spacingY={3} justifyContent={"center"}>
                <FormControl id="username">
                  <FormLabel>Username</FormLabel>
                  <Input
                    placeholder="Enter your username"
                    bg={"rgba(34, 50, 73, 0.65)"}
                    border={"none"}
                    {...register("username", {
                      required: "Username is required",
                      minLength: {
                        value: 3,
                        message: "Username must be at least 3 characters long",
                      },
                      maxLength: {
                        value: 20,
                        message: "Username must be less than 20 characters",
                      },
                    })}
                  />
                  {errors.username && (
                    <Text color="red.500">{errors.username.message}</Text>
                  )}
                </FormControl>

                <FormControl id="email">
                  <FormLabel>Email Address</FormLabel>
                  <Input
                    placeholder="Enter your email address"
                    bg={"rgba(34, 50, 73, 0.65)"}
                    border={"none"}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <Text color="red.500">{errors.email.message}</Text>
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
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message:
                            "Password must be at least 8 characters long",
                        },
                      })}
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={handleShowClick1}
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

                <FormControl id="confirmPassword">
                  <FormLabel>Confirm Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter your password"
                      bg={"rgba(34, 50, 73, 0.65)"}
                      border={"none"}
                      {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) =>
                          value === password.current ||
                          "Passwords do not match",
                      })}
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={handleShowClick2}
                        bg={"transparent"}
                        _hover={{ bg: "none" }}
                      >
                        {showConfirmPassword ? (
                          <ViewOffIcon color={"white"} />
                        ) : (
                          <ViewIcon color={"white"} />
                        )}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  {errors.confirmPassword && (
                    <Text color="red.500">
                      {errors.confirmPassword.message}
                    </Text>
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
                  Sign Up
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
                  <Text>Sign Up with Google</Text>
                </HStack>
              </Flex>
              <Text>
                Already have an account ? <Link to={"/login"}>Log in</Link>
              </Text>
            </Flex>
          </Flex>
        </Stack>
      </Container>
    </Flex>
  );
}
