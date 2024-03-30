import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";
import { Route, Routes, useLocation } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";

const App = () => {
  const location = useLocation();
  const shouldRenderFooter =
    location.pathname !== "/signup" && location.pathname !== "/login";

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      {shouldRenderFooter && <Footer />}
    </>
  );
};

export default App;
