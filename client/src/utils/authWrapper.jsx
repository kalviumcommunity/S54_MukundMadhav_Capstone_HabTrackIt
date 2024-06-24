import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import Loader from "./loader";

const AuthWrapper = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader />;
  }

  // Define protected routes
  const protectedRoutes = ["/dashboard", "/profile", "/leaderboard"];
  // Define routes that logged-in users shouldn't access
  const publicRoutes = ["/login", "/signup", "/"];

  if (!isLoggedIn && protectedRoutes.includes(location.pathname)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isLoggedIn && publicRoutes.includes(location.pathname)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AuthWrapper;
