import React from "react";
import {
    Flex,
    HStack,
    Heading,
    Image,
    Text,
    VStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Dashboard = () => {
    return (
        <>
            <Flex bgGradient="linear(to-br,#1B1745,#233249)" flexDir={"column"} minH="calc(100vh - 5em)">
                <VStack textColor={"white"} justifyContent={"center"} pt={6} mx={40}>
                    <VStack
                        bgColor="#063882"
                        px={10}
                        py={2}
                        borderRadius={10}
                        alignSelf={"flex-start"}
                    >
                        <Heading size={"md"}>Your Score</Heading>
                        <Flex columnGap={2}>
                            <Heading size={"md"}>{0}</Heading>
                            <Image src="Score Icon.svg" h={"1.6rem"} />
                        </Flex>
                    </VStack>
                    <Flex w={"100%"} justifyContent={"space-between"} mt={8}>
                        <VStack bgGradient="linear(to-br,#326BA0,#063882)" minW={"400px"} borderRadius={20} px={4} pb={10} pt={8}>
                            <Heading size={"md"} pb={4}>
                                Good Habits / Habits to do Daily
                            </Heading>
                            <Flex bgColor={"rgba(255, 255, 255, 0.35)"} p={6} borderRadius={6} w={"80%"} flexDir={"column"} rowGap={3} minH={"250px"}>
                                <Flex borderBottom={"1px solid white"} justifyContent={"space-between"} cursor={"pointer"}><Text fontSize={"lg"}>Drink 8 glasses of water</Text><Text textColor={"green"} fontSize={"lg"}>+1</Text></Flex>
                                <Flex borderBottom={"1px solid white"} justifyContent={"space-between"} cursor={"pointer"}><Text fontSize={"lg"}>Exercise for 30 minutes</Text><Text textColor={"green"} fontSize={"lg"}>+1</Text></Flex>
                                <Flex borderBottom={"1px solid white"} justifyContent={"space-between"} cursor={"pointer"}><Text fontSize={"lg"}>Read a book</Text><Text textColor={"green"} fontSize={"lg"}>+1</Text></Flex>
                                <Flex borderBottom={"1px solid white"} justifyContent={"space-between"} cursor={"pointer"}><Text fontSize={"lg"}>Write a journal</Text><Text textColor={"green"} fontSize={"lg"}>+1</Text></Flex>
                                <Flex borderBottom={"1px solid white"} justifyContent={"space-between"} cursor={"pointer"}><Text fontSize={"lg"}>Get 8 hours of sleep</Text><Text textColor={"green"} fontSize={"lg"}>+1</Text></Flex>
                            </Flex>
                        </VStack>
                        <VStack bgGradient="linear(to-br,#326BA0,#063882)" minW={"400px"} borderRadius={20} px={4} pb={10} pt={8}>
                            <Heading size={"md"} pb={4}>
                                Bad Habits / Habits to Break
                            </Heading>
                            <Flex bgColor={"rgba(255, 255, 255, 0.35)"} p={6} borderRadius={6} w={"80%"} flexDir={"column"} rowGap={3} minH={"250px"}>
                                <Flex borderBottom={"1px solid white"} justifyContent={"space-between"} cursor={"pointer"}><Text fontSize={"lg"}>Smoke a cigarette</Text><Text textColor={"red"} fontSize={"lg"}>-1</Text></Flex>
                                <Flex borderBottom={"1px solid white"} justifyContent={"space-between"} cursor={"pointer"}><Text fontSize={"lg"}>Drink alcohol</Text><Text textColor={"red"} fontSize={"lg"}>-1</Text></Flex>
                                <Flex borderBottom={"1px solid white"} justifyContent={"space-between"} cursor={"pointer"}><Text fontSize={"lg"}>Watch TV for 3 hours</Text><Text textColor={"red"} fontSize={"lg"}>-1</Text></Flex>
                                <Flex borderBottom={"1px solid white"} justifyContent={"space-between"} cursor={"pointer"}><Text fontSize={"lg"}>Drink soda</Text><Text textColor={"red"} fontSize={"lg"}>-1</Text></Flex>
                                <Flex borderBottom={"1px solid white"} justifyContent={"space-between"} cursor={"pointer"}><Text fontSize={"lg"}>Order fast food</Text><Text textColor={"red"} fontSize={"lg"}>-1</Text></Flex>
                            </Flex>
                        </VStack>
                    </Flex>
                </VStack>
                <Flex alignSelf={"flex-end"} pr={4}>
                    <Link to={"/leaderboard"}><Image src="Leaderboard Icon.svg" /></Link>
                    <Link><Image src="HabitAI Icon.svg" /></Link>
                </Flex>
            </Flex>
        </>
    );
};

export default Dashboard;
