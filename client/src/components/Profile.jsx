import React, { useState } from "react";
import {
  Avatar,
  Box,
  Flex,
  VStack,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
} from "@chakra-ui/react";
import FileUpload from "../utils/fileUpload";

const Profile = () => {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setSelectedAvatar(file);
    setIsConfirmationOpen(true);
  };

  const handleAvatarClick = () => {
    // Opens the file input dialog when the Avatar is clicked
    document.getElementById("avatar-input").click();
  };

  const handleConfirmationClose = () => {
    setIsConfirmationOpen(false);
  };

  const handleConfirmationConfirm = () => {
    setIsConfirmationOpen(false);
    // Trigger file upload functionality
    document.getElementById("file-upload").click();
  };

  return (
    <Box bgGradient="linear(to-r,#1B1745,#233249)" minH="calc(100vh - 5em)">
      <VStack textColor={"white"} pt={10} justifyContent={"center"}>
        <Flex onClick={handleAvatarClick} cursor={"pointer"}>
          <Avatar
            size={"xl"}
            src={selectedAvatar ? URL.createObjectURL(selectedAvatar) : ""}
          />
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            id="avatar-input"
            style={{ display: "none" }}
            onChange={handleAvatarChange}
          />
        </Flex>
        <AlertDialog
          isOpen={isConfirmationOpen}
          leastDestructiveRef={undefined}
          onClose={handleConfirmationClose}
          isCentered
        >
          <AlertDialogOverlay />
          <AlertDialogContent>
            <AlertDialogHeader>Change Profile Picture</AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to change your profile picture?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={handleConfirmationClose}>Cancel</Button>
              <Button
                colorScheme="red"
                onClick={handleConfirmationConfirm}
                ml={3}
              >
                Confirm
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <FileUpload id="file-upload" file={selectedAvatar} />
      </VStack>
    </Box>
  );
};

export default Profile;
