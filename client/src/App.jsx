import React from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";
import Signup from "./components/Signup";
import Login from "./components/Login";
import WriteUs from "./components/WriteUs";
import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";
import Leaderboard from "./components/Leaderboard";
import AuthWrapper from "./utils/authWrapper";
import { useAuth } from "./contexts/authContext";
import EditHabits from "./components/EditHabits";

const App = () => {
  const location = useLocation();
  const { isLoggedIn } = useAuth();

  const shouldRenderFooter =
    location.pathname !== "/signup" &&
    location.pathname !== "/login" &&
    location.pathname !== "/write-us";

  return (
    <>
      <Navbar />
      <AuthWrapper>
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? <Navigate to="/dashboard" replace /> : <HomePage />
            }
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/write-us" element={<WriteUs />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/edit-habits" element={<EditHabits />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthWrapper>
      {shouldRenderFooter && <Footer />}
    </>
  );
};

export default App;
