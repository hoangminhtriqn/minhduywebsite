import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/contexts/AuthContext";
import React from "react";
import { Navigate } from "react-router-dom";

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  redirectTo = "/",
}) => {
  const { isAuthenticated, loading } = useAuth();

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
