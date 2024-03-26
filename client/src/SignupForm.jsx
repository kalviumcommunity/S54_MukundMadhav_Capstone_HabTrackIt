import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import {
  Box,
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
  Image,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

export default function SignupForm() {
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
        maxW={"800px"}
        boxShadow={"xl"}
        rounded={"2xl"}
        p={6}
        bgGradient="linear(to-br, #326BA0, #063882)"
        className="signup-container"
      >
        <Stack spacing={4} alignItems={"center"}>
          <Heading color="white" as={"h2"} size={"lg"} mb={4}>
            Sign Up For Free
          </Heading>
          <Flex rounded={"lg"} minW={"20vw"} flexDir={"column"}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <SimpleGrid columns={1} spacingY={4} justifyContent={"center"}>
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
            <Divider
              my={4}
              borderColor={"#314664"}
              borderBottomWidth={"2px"}
              w={"90%"}
              alignSelf={"center"}
            />
            <Flex align={"center"} flexDir={"column"}>
              <Heading as={"h4"} fontSize={"md"}>
                Sign Up
              </Heading>
              <Text as={"h5"} fontSize={"xs"}>
                With
              </Text>
              <Flex
                className="3rd-party-authentication-container"
                my={2}
                columnGap={10}
              >
                <a href="">
                  <Image src="./Google Icon.svg" />
                </a>
                <a href="">
                  <Image src="./Facebook Icon.svg" />
                </a>
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
