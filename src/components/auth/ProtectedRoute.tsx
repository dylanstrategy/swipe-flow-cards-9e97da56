
import React from 'react';
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, userProfile, loading } = useAuth();

  if (loading) return null;
  if (!user || !userProfile) return <Navigate to="/login" replace />;
  if (requiredRole && userProfile.role !== requiredRole)
    return <Navigate to="/unknown-role" replace />;

  if (!requiredRole && window.location.pathname === "/") {
    switch (userProfile.role) {
      case "super_admin":
        return <Navigate to="/super-admin" replace />;
      case "operator":
        return <Navigate to="/operator" replace />;
      case "resident":
        return <Navigate to="/discovery" replace />;
      case "prospect":
        return <Navigate to="/discovery" replace />;
      case "vendor":
        return <Navigate to="/maintenance" replace />;
      case "maintenance":
        return <Navigate to="/maintenance" replace />;
      default:
        return <Navigate to="/unknown-role" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
