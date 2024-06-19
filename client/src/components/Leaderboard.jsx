import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Flex,
  HStack,
  Heading,
  IconButton,
  VStack,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import axios from "axios";

const Leaderboard = () => {
  const [leads, setLeads] = useState([]);
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/leads`
        );
        setLeads(response.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchLeads();
  }, []);
  return (
    <>
      <Flex
        bgGradient="linear(to-br,#1B1745,#233249)"
        flexDir={"column"}
        minH="calc(100vh - 5em)"
        pt={4}
        textColor={"white"}
      >
        <Flex mx={40} flexDir={"column"}>
          <Box>
            <Link to={"/dashboard"}>
              <IconButton
                aria-label="Back to Dashboard"
                icon={<ArrowBackIcon boxSize={8} />}
                colorScheme="transparent"
              />
            </Link>
          </Box>
          <VStack
            bgColor={"rgba(217, 217, 217, 1)"}
            textColor={"rgba(45, 145, 115, 1)"}
            w={"50%"}
            alignSelf={"center"}
            borderTopRadius={10}
            py={8}
            minH={"80.5vh"}
          >
            <Heading mb={4}>All time Leads</Heading>
            {leads.map((lead, index) => (
              <Flex key={lead._id} w={"80%"} justifyContent={"center"}>
                <HStack
                  w={"100%"}
                  borderBottom={"1px solid black"}
                  color={"black"}
                  py={2}
                >
                  <Heading fontSize={"lg"} mr={6}>
                    {index + 1}
                  </Heading>
                  <Flex columnGap={4} w={"350px"} alignItems={"center"}>
                    <Avatar src={lead.profilePicture}/>
                    <Heading fontSize={"lg"}>{lead.username}</Heading>
                  </Flex>
                  <Flex
                    columnGap={1}
                    alignItems={"baseline"}
                    textColor={"rgba(45, 145, 115, 1)"}
                  >
                    <Heading fontSize={"3xl"}>{lead.userScore}</Heading>
                    <Heading fontSize={"lg"}>Points</Heading>
                  </Flex>
                </HStack>
              </Flex>
            ))}
          </VStack>
        </Flex>
      </Flex>
    </>
  );
};

export default Leaderboard;
