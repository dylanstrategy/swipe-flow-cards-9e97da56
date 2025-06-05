
import React from 'react';
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, userProfile, loading } = useAuth();

  console.log('ProtectedRoute check:', { 
    loading, 
    user: user?.email, 
    userProfile: userProfile?.email, 
    role: userProfile?.role,
    requiredRole,
    currentPath: window.location.pathname
  });

  if (loading) {
    console.log('ProtectedRoute: Still loading...');
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log('ProtectedRoute: No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (!userProfile) {
    console.log('ProtectedRoute: No user profile, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userProfile.role !== requiredRole) {
    console.log('ProtectedRoute: Role mismatch, redirecting to unknown-role');
    return <Navigate to="/unknown-role" replace />;
  }

  if (!requiredRole && window.location.pathname === "/") {
    console.log('ProtectedRoute: Role-based redirect for:', userProfile.role);
    switch (userProfile.role) {
      case "super_admin":
        console.log('Redirecting super_admin to /super-admin');
        return <Navigate to="/super-admin" replace />;
      case "operator":
        console.log('Redirecting operator to /operator');
        return <Navigate to="/operator" replace />;
      case "resident":
        console.log('Redirecting resident to /discovery');
        return <Navigate to="/discovery" replace />;
      case "prospect":
        console.log('Redirecting prospect to /discovery');
        return <Navigate to="/discovery" replace />;
      case "vendor":
        console.log('Redirecting vendor to /maintenance');
        return <Navigate to="/maintenance" replace />;
      case "maintenance":
        console.log('Redirecting maintenance to /maintenance');
        return <Navigate to="/maintenance" replace />;
      default:
        console.log('Unknown role, redirecting to /unknown-role');
        return <Navigate to="/unknown-role" replace />;
    }
  }

  console.log('ProtectedRoute: Access granted');
  return <>{children}</>;
};

export default ProtectedRoute;
