import React from "react";
import {
  Flex,
  Stack,
  VStack,
  Heading,
  Text,
  Image,
  Card,
  CardBody,
  CardFooter,
} from "@chakra-ui/react";
import SignupForm from "./SignupForm";

const HomePage = () => {
  return (
    <>
      <Stack
        as="main"
        className="main-container"
        flexDir="row"
        py={12}
        px={16}
        color="white"
        bgGradient="linear(to-br, #1B1745, #233249)"
        minH="100vh"
        justifyContent={"space-between"}
      >
        <Flex className="left-section" flexDir="column" maxW="58vw">
          <Flex flexDir="column">
            <Heading as="h2" size="xl">
              Unleash the Power of Tiny Changes: Track Your Habits, Transform
              Your Life on{" "}
              <Text as="b" fontWeight="black">
                HabTrackIt
              </Text>
            </Heading>
            <Image
              src="./Home Illustration.svg"
              h="444px"
              w="426px"
              my={4}
              ml={28}
            />
          </Flex>
          <VStack>
            <Flex flexDir="column" rowGap={4}>
              <Heading as="h3" size="lg" mb={2}>
                Features :
              </Heading>
              <Text fontSize="md">
                <Text fontWeight="800" as="span">
                  Habit Tracking :{" "}
                </Text>{" "}
                Users can easily add and track their daily habits, both positive
                and negative, using a user-friendly interface. User can
                personalize each habit by setting how often he/she want to do
                it, and much more.
              </Text>
              <Text fontSize="md">
                <Text fontWeight="800" as="span">
                  Streak Building :
                </Text>{" "}
                HabTrackIt helps you stay on track with your positive habits by
                letting you create streaks for sticking to them day after day.
              </Text>
              <Text fontSize="md">
                <Text fontWeight="800" as="span">
                  Bad Habit Breaker :
                </Text>{" "}
                Users can set goals for breaking bad habits, HabTrackIt shows
                progress insights, reminders to help overcome challenges of
                quitting habits.
              </Text>
              <Text fontSize="md">
                <Text fontWeight="800" as="span">
                  Progress Visualization :
                </Text>{" "}
                HabTrackIt offers insightful visualizations of habit progress,
                achievements, and areas that may need improvement. This helps
                users stay motivated and focused on their goals.
              </Text>
              <Text fontSize="md">
                <Text fontWeight="800" as="span">
                  Reminders and Notifications :
                </Text>{" "}
                HabTrackIt has reminders feature and sends notifications to make
                sure you don't forget to log your habits.
              </Text>
              <Text fontSize="md">
                <Text fontWeight="800" as="span">
                  Leaderboard :
                </Text>{" "}
                HabTrackIt introduces a competitive edge to habit building with
                a leaderboard feature. Users can see how their habit streaks add
                up against others in the community, which adds motivation to
                stay on the track and be consistent.
              </Text>
            </Flex>
            <Card className="scientific-quotes" px={6}>
              <CardBody>
                <Text as="i" fontSize="lg">
                  “Track every action that relates to the area of your life you
                  want to improve. All winners are trackers.”
                </Text>
              </CardBody>
              <CardFooter
                flexDir="column"
                alignSelf="flex-end"
                textAlign="right"
              >
                <Text as="b">- Darren Hardy</Text>
                <Text as="i">
                  The Compound Effect: Jump Start Your Income, Your Life, Your
                  Success
                </Text>
              </CardFooter>
            </Card>
          </VStack>
        </Flex>
        <Flex className="signup-form right-section" align={"flex-start"}>
          <SignupForm />
        </Flex>
      </Stack>
    </>
  );
};

export default HomePage;
