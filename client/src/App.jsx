import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";
import { Route, Routes, useLocation } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import WriteUs from "./components/WriteUs";
import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";
import Leaderboard from "./components/Leaderboard";

const App = () => {
  const location = useLocation();
  const shouldRenderFooter =
    location.pathname !== "/signup" &&
    location.pathname !== "/login" &&
    location.pathname !== "/write-us";

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/write-us" element={<WriteUs />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
      {shouldRenderFooter && <Footer />}
    </>
  );
};

export default App;
