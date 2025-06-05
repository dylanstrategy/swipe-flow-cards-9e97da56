
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
  const { user, userProfile, loading, isImpersonating, isDevMode, devModeRole } = useAuth();

  if (process.env.NODE_ENV === 'development') {
    console.log('🔒 ProtectedRoute check:', { 
      user: !!user, 
      userProfile: userProfile?.role, 
      requiredRole, 
      loading,
      isImpersonating,
      isDevMode
    });
  }

  // Always show loading screen while auth is being determined
  if (loading) {
    return <LoadingScreen />;
  }

  // Allow access during dev mode or impersonation
  if (isDevMode || isImpersonating) {
    const effectiveRole = isDevMode ? devModeRole : userProfile?.role;
    
    // If role is required during dev/impersonation, check it
    if (requiredRole && effectiveRole !== requiredRole) {
      if (process.env.NODE_ENV === 'development') {
        console.log('🚫 Dev/Impersonation role mismatch:', effectiveRole, 'vs required:', requiredRole);
      }
      return <Navigate to="/unknown-role" replace />;
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Dev/Impersonation access granted');
    }
    return <>{children}</>;
  }

  // If no user, redirect to login
  if (!user || !userProfile) {
    if (process.env.NODE_ENV === 'development') {
      console.log('🚫 No user/profile, redirecting to login');
    }
    return <Navigate to="/login" replace />;
  }

  // If role is required, check permissions
  if (requiredRole) {
    // Super admins can access everything
    const isOriginalSuperAdmin = user.email === 'info@applaudliving.com';
    
    // If the current effective role doesn't match required role AND user is not originally a super admin
    if (userProfile.role !== requiredRole && !isOriginalSuperAdmin) {
      if (process.env.NODE_ENV === 'development') {
        console.log('🚫 Role mismatch:', userProfile.role, 'vs required:', requiredRole, 'isOriginalSuperAdmin:', isOriginalSuperAdmin);
      }
      return <Navigate to="/unknown-role" replace />;
    }
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('✅ Access granted');
  }
  return <>{children}</>;
};

export default ProtectedRoute;
