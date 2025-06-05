
import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // No authentication checks - just render children
  return <>{children}</>;
};

export default ProtectedRoute;
