
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    </div>
  );
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, userProfile, loading } = useAuth();

  console.log('🔒 ProtectedRoute check:', { 
    user: !!user, 
    userProfile: userProfile?.role, 
    requiredRole, 
    loading 
  });

  if (loading) {
    return <LoadingScreen />;
  }

  // If no user, redirect to login
  if (!user || !userProfile) {
    console.log('🚫 No user/profile, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // If role is required and doesn't match, redirect to unknown role
  if (requiredRole && userProfile.role !== requiredRole) {
    console.log('🚫 Role mismatch:', userProfile.role, 'vs required:', requiredRole);
    return <Navigate to="/unknown-role" replace />;
  }

  console.log('✅ Access granted');
  return <>{children}</>;
};

export default ProtectedRoute;
