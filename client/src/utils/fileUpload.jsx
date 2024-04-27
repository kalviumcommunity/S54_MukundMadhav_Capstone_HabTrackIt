import React, { useState } from "react";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { useToast } from "@chakra-ui/react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { storage } from "../firebase/firebase";
import Cookies from "js-cookie";

const FileUpload = ({ file }) => {
  const toast = useToast();
  const handleUpload = async () => {
    try {
      if (!file) {
        return;
      }
      const imageRef = ref(storage, `images/${file.name + uuidv4()}`);
      const snapshot = await uploadBytes(imageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      try {
        const updateProfile = await axios.put(
          `${import.meta.env.VITE_API_URL}/update-profile-picture`,
          {
            profilePicture: url,
          },
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        toast({
          title: "Profile Picture uploaded successfully",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (error) {
        console.error("Error updating profile picture:", error);
        toast({
          title: "Error updating profile picture",
          description: `${error.message}`,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error uploading image",
        description: `${error.message}`,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <div style={{ display: "none" }}>
      <button id="file-upload" onClick={handleUpload}></button>
    </div>
  );
};

export default FileUpload;
