
import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  // Bypass authentication for now - direct access to dashboard
  return <>{children}</>;
};

export default ProtectedRoute;
