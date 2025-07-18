import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  redirectTo = "/",
}) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Show loading spinner while checking authentication status
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    // Redirect authenticated users to the specified route (default: home page)
    return <Navigate to={redirectTo} replace />;
  }

  // If not authenticated, render the children (login/register pages)
  return <>{children}</>;
};

export default PublicRoute;
