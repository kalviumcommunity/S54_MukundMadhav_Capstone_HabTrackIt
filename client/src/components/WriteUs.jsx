import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import emailjs from "@emailjs/browser";
import { TailSpin } from "react-loader-spinner";
import {
  Flex,
  Image,
  Stack,
  VStack,
  Container,
  Heading,
  Box,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Text,
  useToast,
} from "@chakra-ui/react";

const WriteUs = () => {
  const [loading, setLoading] = useState(false);
  const [emailInitialized, setEmailInitialized] = useState(false);

  useEffect(() => {
    const initEmailJs = () => {
      try {
        emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
        setEmailInitialized(true);
      } catch (error) {
        console.error("Failed to initialize EmailJS:", error);
      }
    };

    initEmailJs();
  }, []);

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });
  const toast = useToast();

  const onSubmit = async (values) => {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    try {
      setLoading(true);
      const { usernameOrEmail, query } = values;
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/identify-user`,
        {
          usernameOrEmail,
        }
      );
      if (response.status === 200 && response.data.user) {
        const templeteParams = {
          from_name: response.data.user.username,
          from_email: response.data.user.email,
          to_name: "Mukund Madhav",
          message: query,
        };

        await sendEmail(serviceId, templateId, templeteParams);

        toast({
          title: "Message Sent Successfully",
          description: "You will hear from us ASAP.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast({
          title: "An error occurred",
          description: "Please try again later.",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast({
          title: "User Not Found",
          description: "The provided username or email does not exist.",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      } else {
        toast({
          title: "An error occurred",
          description: "Please try again later.",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const sendEmail = async (serviceId, templateId, templateParams) => {
    try {
      await emailjs.send(serviceId, templateId, templateParams);
    } catch (error) {
      console.error("Failed to send email:", error);
      throw new Error("Failed to send email");
    }
  };

  return (
    <>
      <Box bgGradient="linear(to-br,#1B1745,#233249)" minH="calc(100vh - 5em)">
        <VStack textColor={"white"} pt={6} justifyContent={"center"}>
          <Flex flexDir={"column"} alignItems={"center"}>
            <Flex className="write-us-form">
              <Flex align={"center"} justify={"center"}>
                <Container
                  w={["80vw", "45vw", "28vw", "29vw"]}
                  boxShadow={"xl"}
                  rounded={"2xl"}
                  p={["4vw", "4vw", "2vw", "2vw"]}
                  bgGradient="linear(to-br, #326BA0, #063882)"
                  className="write-us-container"
                >
                  <Stack spacing={2} alignItems={"center"}>
                    <Heading
                      color="white"
                      as={"h2"}
                      size={"md"}
                      mb={4}
                      textAlign={"center"}
                    >
                      Having Trouble with something? <br />
                      Write to us!
                    </Heading>
                    <Flex rounded={"lg"} flexDir={"column"} w="100%">
                      {emailInitialized ? (
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <SimpleGrid
                            columns={1}
                            spacingY={3}
                            justifyContent={"center"}
                          >
                            <FormControl id="usernameOrEmail">
                              <FormLabel>Username or Email</FormLabel>
                              <Input
                                placeholder="Enter your Username or Email"
                                _placeholder={{ fontSize: "2vh" }}
                                bg={"rgba(34, 50, 73, 0.65)"}
                                w={"100%"}
                                border={"none"}
                                {...register("usernameOrEmail", {
                                  required: "This field is required",
                                  minLength: {
                                    value: 3,
                                    message:
                                      "Input must be at least 3 characters long",
                                  },
                                })}
                              />
                              {errors.usernameOrEmail && (
                                <Text color="red.500">
                                  {errors.usernameOrEmail.message}
                                </Text>
                              )}
                            </FormControl>

                            <FormControl id="query">
                              <FormLabel>Query</FormLabel>
                              <Textarea
                                placeholder="Enter your Query"
                                bg={"rgba(34, 50, 73, 0.65)"}
                                _placeholder={{ fontSize: "2vh" }}
                                border={"none"}
                                w={["72vw", "37vw", "24vw", "25vw"]}
                                {...register("query", {
                                  required: "This field is required",
                                  minLength: {
                                    value: 5,
                                    message:
                                      "Your query must be at least 5 characters long",
                                  },
                                })}
                              />
                              {errors.query && (
                                <Text color="red.500">
                                  {errors.query.message}
                                </Text>
                              )}
                            </FormControl>
                            <Button
                              color={"white"}
                              type="submit"
                              maxW={"fit-content"}
                              justifySelf={"center"}
                              disabled={!isValid || loading}
                              fontWeight={"bold"}
                              fontSize={"3vh"}
                              variant={"solid"}
                              _hover={{ bgColor: "#2985DC" }}
                              bgColor={"#316AA0"}
                            >
                              {loading ? (
                                <TailSpin
                                  color={"white"}
                                  height={30}
                                  width={30}
                                />
                              ) : (
                                "Submit"
                              )}
                            </Button>
                          </SimpleGrid>
                        </form>
                      ) : (
                        <Text align={"center"}>
                          Initializing email service...
                        </Text>
                      )}
                    </Flex>
                  </Stack>
                </Container>
              </Flex>
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
    </>
  );
};

export default WriteUs;
