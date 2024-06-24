import React from "react";
import { Center } from "@chakra-ui/react";
import { ScaleLoader } from "react-spinners";

const Loader = () => {
  return (
    <>
      <Center
        bgGradient="linear(to-br,#1B1745,#233249)"
        flexDir={"column"}
        minH="calc(100vh - 5em)"
      >
        <ScaleLoader color="#EDDFEF" />
      </Center>
    </>
  );
};

export default Loader;
