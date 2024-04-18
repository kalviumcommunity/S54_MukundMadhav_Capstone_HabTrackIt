import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme.jsx";
import App from "./App.jsx";
import { AuthContextProvider } from "./contexts/authContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
      <AuthContextProvider>
        <ChakraProvider theme={theme}>
          <App />
        </ChakraProvider>
      </AuthContextProvider>
    </BrowserRouter>
);
