import React from 'react'
import { Avatar, Box, Flex, HStack, Heading, IconButton, VStack } from "@chakra-ui/react"
import { ArrowBackIcon } from "@chakra-ui/icons"
import { Link } from 'react-router-dom'

const Leaderboard = () => {
    return (
        <>
            <Flex bgGradient="linear(to-br,#1B1745,#233249)" flexDir={"column"} minH="calc(100vh - 5em)" pt={4} textColor={"white"}>
                <Flex mx={40} flexDir={"column"}>
                    <Box>
                        <Link to={"/dashboard"}>
                            <IconButton
                                aria-label="Back to Dashboard"
                                icon={<ArrowBackIcon boxSize={8} />}
                                colorScheme="transparent"
                            /></Link>
                    </Box>
                    <VStack bgColor={"rgba(217, 217, 217, 1)"} textColor={"rgba(45, 145, 115, 1)"} w={"50%"} alignSelf={"center"} borderTopRadius={10} py={8} minH="511px">
                        <Heading mb={4}>All time Leads</Heading>
                        <Flex w={"80%"} justifyContent={"center"}>
                            <HStack w={"100%"} borderBottom={"1px solid black"} color={"black"} py={2}>
                                <Heading fontSize={"lg"} mr={6}>1</Heading>
                                <Flex columnGap={4} w={"350px"} alignItems={"center"}><Avatar /><Heading fontSize={"lg"}>Prashant Verma</Heading></Flex>
                                <Flex columnGap={1} alignItems={"baseline"} textColor={"rgba(45, 145, 115, 1)"}><Heading fontSize={"3xl"} >800</Heading><Heading fontSize={"lg"}>Points</Heading></Flex>
                            </HStack>
                        </Flex>
                        <Flex w={"100%"} justifyContent={"center"}>
                            <HStack w={"80%"} borderBottom={"1px solid black"} color={"black"} py={2}>
                                <Heading fontSize={"lg"} mr={6}>2</Heading>
                                <Flex columnGap={4} w={"350px"} alignItems={"center"}><Avatar /><Heading fontSize={"lg"}>Ashish Rawal</Heading></Flex>
                                <Flex columnGap={1} alignItems={"baseline"} textColor={"rgba(45, 145, 115, 1)"}><Heading fontSize={"3xl"} >754</Heading><Heading fontSize={"lg"}>Points</Heading></Flex>
                            </HStack>
                        </Flex>
                        <Flex w={"100%"} justifyContent={"center"}>
                            <HStack w={"80%"} borderBottom={"1px solid black"} color={"black"} py={2}>
                                <Heading fontSize={"lg"} mr={6}>3</Heading>
                                <Flex columnGap={4} w={"350px"} alignItems={"center"}><Avatar /><Heading fontSize={"lg"}>Pratik Kumar</Heading></Flex>
                                <Flex columnGap={1} alignItems={"baseline"} textColor={"rgba(45, 145, 115, 1)"}><Heading fontSize={"3xl"} >699</Heading><Heading fontSize={"lg"}>Points</Heading></Flex>
                            </HStack>
                        </Flex>
                        <Flex w={"100%"} justifyContent={"center"}>
                            <HStack w={"80%"} borderBottom={"1px solid black"} color={"black"} py={2}>
                                <Heading fontSize={"lg"} mr={6}>4</Heading>
                                <Flex columnGap={4} w={"350px"} alignItems={"center"}><Avatar /><Heading fontSize={"lg"}>Rajat D.</Heading></Flex>
                                <Flex columnGap={1} alignItems={"baseline"} textColor={"rgba(45, 145, 115, 1)"}><Heading fontSize={"3xl"} >689</Heading><Heading fontSize={"lg"}>Points</Heading></Flex>
                            </HStack>
                        </Flex>
                        <Flex w={"100%"} justifyContent={"center"}>
                            <HStack w={"80%"} borderBottom={"1px solid black"} color={"black"} py={2}>
                                <Heading fontSize={"lg"} mr={6}>5</Heading>
                                <Flex columnGap={4} w={"350px"} alignItems={"center"}><Avatar /><Heading fontSize={"lg"}>Sagar Thakur</Heading></Flex>
                                <Flex columnGap={1} alignItems={"baseline"} textColor={"rgba(45, 145, 115, 1)"}><Heading fontSize={"3xl"} >307</Heading><Heading fontSize={"lg"}>Points</Heading></Flex>
                            </HStack>
                        </Flex>
                        <Flex w={"100%"} justifyContent={"center"}>
                            <HStack w={"80%"} borderBottom={"1px solid black"} color={"black"} py={2}>
                                <Heading fontSize={"lg"} mr={6}>6</Heading>
                                <Flex columnGap={4} w={"350px"} alignItems={"center"}><Avatar /><Heading fontSize={"lg"}>You</Heading></Flex>
                                <Flex columnGap={1} alignItems={"baseline"} textColor={"rgba(45, 145, 115, 1)"}><Heading fontSize={"3xl"} >54</Heading><Heading fontSize={"lg"}>Points</Heading></Flex>
                            </HStack>
                        </Flex>
                    </VStack>
                </Flex>

            </Flex>
        </>
    )
}

export default Leaderboard