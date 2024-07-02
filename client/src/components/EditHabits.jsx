import React, { useEffect, useState } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import { IconButton, VStack, useDisclosure } from "@chakra-ui/react"
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Input,
    FormControl,
    FormLabel,
    Box, Flex, Heading, Text
} from "@chakra-ui/react"
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";

const EditHabits = () => {
    const [habits, setHabits] = useState([])
    const [newHabitTitle, setNewHabitTitle] = useState("")
    const [newHabitType, setNewHabitType] = useState("")
    const [selectedHabit, setSelectedHabit] = useState(null)

    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(() => {
        getAllHabits()
    }, [])

    const getAllHabits = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/habits`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get("token")}`,
                },
            })
            setHabits(response.data)
        } catch (error) {
            console.error(`Error fetching habits: ${error.message}`)
        }
    }

    const addHabit = async () => {
        try {
            if (!newHabitTitle.trim()) {
                alert("Habit Title cannot be empty.")
                return
            }
            const newHabitTypeLowerCased = newHabitType.toLowerCase()
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/habits`,
                {
                    title: newHabitTitle,
                    type: newHabitTypeLowerCased,
                },
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("token")}`,
                    },
                }
            )
            setHabits([...habits, response.data])
            setNewHabitTitle("")
            setNewHabitType("")
            onClose()
        } catch (error) {
            // console.log(`Error adding new Habit: ${error}`)
            console.error("Error updating habit:", error)
        }
    }

    const updateHabit = async () => {
        try {
            if (!selectedHabit.title.trim()) {
                alert("Habit Title cannot be empty.")
                return
            }
            const originalHabit = habits.find(habit => habit._id === selectedHabit._id);
            if (originalHabit.title === selectedHabit.title.trim()) {
                alert("New Habit Title cannot be the same as the current title.");
                return;
            }
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/habits/update/${selectedHabit._id}`,
                {
                    title: selectedHabit.title,
                }
            )
            const updatedHabitIndex = habits.findIndex(
                (habit) => habit._id === selectedHabit._id
            )
            const updatedHabits = [...habits]
            updatedHabits[updatedHabitIndex] = response.data
            setHabits(updatedHabits)
            setSelectedHabit(null)
            onClose()
        } catch (error) {
            console.error("Error updating habit:", error)
        }
    }

    const deleteHabit = async (habitId) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/habits/delete/${habitId}`)
            setHabits(habits.filter((habit) => habit._id !== habitId))
        } catch (error) {
            console.error("Error deleting habit:", error)
        }
    }

    const openAddModal = () => {
        setSelectedHabit(null)
        onOpen()
    }

    const openUpdateModal = (habit) => {
        setSelectedHabit(habit)
        onOpen()
    }

    return (
        <>
            <Box py={6} px={16} minH="calc(100vh - 5em)" bgGradient="linear(to-br,#1B1745,#233249)" textColor={"white"}>
                <VStack>
                    <Flex alignSelf={"flex-start"}>
                        <Link to={"/dashboard"}>
                            <IconButton
                                aria-label="Back to Dashboard"
                                icon={<ArrowBackIcon boxSize={8} />}
                                colorScheme="transparent"
                            />
                        </Link>
                    </Flex>
                    <Flex alignSelf="center" mb={4}>
                        <Heading>Edit Habits</Heading>
                    </Flex>
                    <Button colorScheme="blue" mb={4} onClick={openAddModal} alignSelf={"flex-end"}>
                        Add New Habit
                    </Button>
                </VStack>

                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>
                            {selectedHabit ? "Update Habit" : "Add New Habit"}
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <FormControl>
                                <FormLabel>Habit Title</FormLabel>
                                <Input
                                    placeholder="Habit Title"
                                    value={selectedHabit?.title || newHabitTitle}
                                    onChange={(e) =>
                                        selectedHabit
                                            ? setSelectedHabit({ ...selectedHabit, title: e.target.value })
                                            : setNewHabitTitle(e.target.value)
                                    }
                                />
                            </FormControl>

                            {!selectedHabit && (
                                <FormControl mt={4}>
                                    <FormLabel>Habit Type</FormLabel>
                                    <Input
                                        placeholder="Enter either good or bad"
                                        value={newHabitType}
                                        onChange={(e) => setNewHabitType(e.target.value)}
                                    />
                                </FormControl>
                            )}
                        </ModalBody>

                        <ModalFooter>
                            <Button colorScheme="blue" mr={3} onClick={selectedHabit ? updateHabit : addHabit}>
                                Save
                            </Button>
                            <Button onClick={onClose}>Cancel</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                {/* Render the list of habits */}
                <Flex flexDir={"column"} pt={4} rowGap={4}>
                    {habits.map((habit) => (
                        <Flex
                            key={habit._id}
                            justify="space-between"
                            align="center"
                            p={4}
                            borderWidth={1}
                            borderRadius={8}
                            mb={2}
                        >
                            <Text>{habit.title}</Text>
                            <Flex>
                                <Button colorScheme="blue" mr={2} onClick={() => openUpdateModal(habit)}>
                                    Update
                                </Button>
                                <Button colorScheme="red" onClick={() => deleteHabit(habit._id)}>
                                    Delete
                                </Button>
                            </Flex>
                        </Flex>
                    ))}
                </Flex>
            </Box>
        </>
    )
}

export default EditHabits