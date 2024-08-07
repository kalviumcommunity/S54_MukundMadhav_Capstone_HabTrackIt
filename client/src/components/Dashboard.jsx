import React, { useEffect, useState, useRef } from "react";
import {
  Flex,
  Heading,
  Image,
  Text,
  VStack,
  IconButton,
  Tooltip,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  Center,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import Cookies from "js-cookie";

const Dashboard = () => {
  const [goodHabits, setGoodHabits] = useState([]);
  const [badHabits, setBadHabits] = useState([]);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [cheeringMessage, setCheeringMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const { userScore, setUserScore } = useAuth();
  const cancelRef = useRef();

  const fetchHabits = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/habits`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      const habits = response.data;
      if (habits.length === 0) {
        setErrorMessage("No habits found. Please add some habits to display.");
      } else {
        const activeHabits = habits.filter((habit) => habit.status === false);
        setGoodHabits(activeHabits.filter((habit) => habit.type === "good"));
        setBadHabits(activeHabits.filter((habit) => habit.type === "bad"));

        if (activeHabits.length === 0) {
          setCheeringMessage(
            "Great job! Come back tomorrow to update your habits."
          );
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessage("No habits found. Please add some habits to display.");
      } else {
        console.log("Error fetching habits:", error.message);
        setErrorMessage("Error fetching habits. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleHabitClick = (habit) => {
    setSelectedHabit(habit);
    setIsAlertOpen(true);
  };

  const handleAlertClose = () => {
    setIsAlertOpen(false);
    setSelectedHabit(null);
  };

  const updateUserScore = async (newScore) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/update-score`,
        {
          userScore: newScore,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      setUserScore(newScore);
    } catch (error) {
      console.error("Error updating user score:", error);
    }
  };

  const updateHabitStatus = async (habitId, status) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/habits/update/${habitId}`,
        {
          status,
        }
      );
      // Fetch updated habits and scores after updating habit status
      fetchHabits();
    } catch (error) {
      console.error("Error updating habit status:", error);
    }
  };

  const handleAlertConfirm = async (response) => {
    if (selectedHabit) {
      let scoreChange = 0;
      if (selectedHabit.type === "good") {
        scoreChange = response === "Yes" ? 1 : -1;
      } else if (selectedHabit.type === "bad") {
        scoreChange = response === "Yes" ? -1 : 1;
      }

      const newScore = userScore + scoreChange;
      await updateUserScore(newScore);
      await updateHabitStatus(selectedHabit._id, true);
      handleAlertClose();
    }
  };

  if (loading) {
    return <Center minH="calc(100vh - 5em)"></Center>;
  }

  return (
    <>
      <Flex
        bgGradient="linear(to-br,#1B1745,#233249)"
        flexDir={"column"}
        minH="calc(100vh - 5em)"
        className="background"
      >
        <Flex
          textColor={"white"}
          className="main-container"
          flexDir={"column"}
          pt={6}
          mx={40}
          rowGap={2}
        >
          <Flex
            className="top-section"
            w={"100%"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Flex
              bgColor="#063882"
              px={10}
              borderRadius={10}
              className="score-container"
              flexDir={"column"}
              justifyContent={"center"}
              alignItems={"center"}
              rowGap={2}
              h={"4.6em"}
            >
              <Heading size={"md"}>Your Score</Heading>
              <Flex columnGap={2}>
                <Heading size={"md"}>{userScore}</Heading>
                <Image src="Score Icon.svg" h={"1.6rem"} />
              </Flex>
            </Flex>
            <Flex>
              <Link to={"/edit-habits"}>
                <Button colorScheme="cyan">Edit Your Habits</Button>
              </Link>
            </Flex>
          </Flex>
          {errorMessage ? (
            <Center minH="60vh">
              <Heading size="lg">{errorMessage}</Heading>
            </Center>
          ) : (
            <>
              {cheeringMessage ? (
                <Center minH="60vh">
                  <Heading size="lg">{cheeringMessage}</Heading>
                </Center>
              ) : (
                <Flex w="100%" justifyContent="space-between" mt={8}>
                  <VStack
                    bgGradient="linear(to-br,#326BA0,#063882)"
                    minW="400px"
                    borderRadius={20}
                    px={4}
                    pb={10}
                    pt={8}
                  >
                    <Heading size="md" pb={4}>
                      Good Habits / Habits to do Daily
                    </Heading>
                    <Flex
                      bgColor="rgba(255, 255, 255, 0.35)"
                      p={6}
                      borderRadius={6}
                      w="80%"
                      flexDir="column"
                      rowGap={3}
                      minH="250px"
                    >
                      {goodHabits.map((habit) => (
                        <Flex
                          key={habit._id}
                          borderBottom="1px solid white"
                          justifyContent="space-between"
                          cursor="pointer"
                          onClick={() => handleHabitClick(habit)}
                        >
                          <Text fontSize="lg">{habit.title}</Text>
                          <Text textColor="green" fontSize="lg">
                            +1
                          </Text>
                        </Flex>
                      ))}
                    </Flex>
                  </VStack>
                  <VStack
                    bgGradient="linear(to-br,#326BA0,#063882)"
                    minW="400px"
                    borderRadius={20}
                    px={4}
                    pb={10}
                    pt={8}
                  >
                    <Heading size="md" pb={4}>
                      Bad Habits / Habits to Break
                    </Heading>
                    <Flex
                      bgColor="rgba(255, 255, 255, 0.35)"
                      p={6}
                      borderRadius={6}
                      w="80%"
                      flexDir="column"
                      rowGap={3}
                      minH="250px"
                    >
                      {badHabits.map((habit) => (
                        <Flex
                          key={habit._id}
                          borderBottom="1px solid white"
                          justifyContent="space-between"
                          cursor="pointer"
                          onClick={() => handleHabitClick(habit)}
                        >
                          <Text fontSize="lg">{habit.title}</Text>
                          <Text textColor="red" fontSize="lg">
                            -1
                          </Text>
                        </Flex>
                      ))}
                    </Flex>
                  </VStack>
                </Flex>
              )}
            </>
          )}
        </Flex>
        <Flex alignSelf={"flex-end"} justifyContent={"center"} pr={4}>
          <Tooltip label="Leaderboard" placement="bottom">
            <Link to="/leaderboard">
              <Image src="Leaderboard Icon.svg" alt="Leaderboard" />
            </Link>
          </Tooltip>

          {/* <Tooltip label="HabitAI" placement="bottom">
            <IconButton
              aria-label="HabitAI"
              icon={<Image src="HabitAI Icon.svg" />}
              display="initial"
              boxSize="fit-content"
              colorScheme="transparent"
            />
          </Tooltip> */}
        </Flex>
      </Flex>

      {selectedHabit && (
        <AlertDialog
          isOpen={isAlertOpen}
          leastDestructiveRef={cancelRef}
          isCentered={true}
          onClose={handleAlertClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader
                fontSize="lg"
                fontWeight="bold"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                {selectedHabit.title}
                <IconButton
                  icon={<CloseIcon />}
                  size="sm"
                  onClick={handleAlertClose}
                />
              </AlertDialogHeader>

              <AlertDialogBody>
                {selectedHabit.type === "good"
                  ? "Did you complete this good habit today?"
                  : "Did you do this bad habit today?"}
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button
                  ref={cancelRef}
                  onClick={() => handleAlertConfirm("No")}
                >
                  No
                </Button>
                <Button
                  colorScheme="green"
                  onClick={() => handleAlertConfirm("Yes")}
                  ml={3}
                >
                  Yes
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      )}
    </>
  );
};

export default Dashboard;
