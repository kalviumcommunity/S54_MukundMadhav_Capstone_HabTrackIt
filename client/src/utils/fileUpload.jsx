import React, { useState } from "react";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { storage } from "../firebase/firebase";
import Cookies from "js-cookie";

const FileUpload = ({ file }) => {
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
      } catch (error) {
        console.error("Error updating profile picture:", error);
      }
      alert("Profile Picture uploaded successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div style={{ display: "none" }}>
      <button id="file-upload" onClick={handleUpload}></button>
    </div>
  );
};

export default FileUpload;
