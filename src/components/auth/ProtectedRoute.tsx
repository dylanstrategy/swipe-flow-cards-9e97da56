
import React from 'react';
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, userProfile, loading } = useAuth();

  console.log('🛡️ ProtectedRoute Check:');
  console.log('  - Loading:', loading);
  console.log('  - User:', user?.email || 'None');
  console.log('  - UserProfile:', userProfile?.email || 'None');
  console.log('  - Role:', userProfile?.role || 'None');
  console.log('  - Required Role:', requiredRole || 'None');
  console.log('  - Current Path:', window.location.pathname);

  if (loading) {
    console.log('🔄 ProtectedRoute: Still loading auth state...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    console.log('❌ ProtectedRoute: No user, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  if (!userProfile) {
    console.log('❌ ProtectedRoute: No user profile found');
    console.log('🔍 This usually means the profile wasn\'t created in public.users table');
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-4">Your user profile wasn't found in the database.</p>
          <p className="text-sm text-gray-500">Email: {user.email}</p>
          <p className="text-sm text-gray-500">User ID: {user.id}</p>
          <div className="mt-4">
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (requiredRole && userProfile.role !== requiredRole) {
    console.log('❌ ProtectedRoute: Role mismatch');
    console.log('  - User role:', userProfile.role);
    console.log('  - Required role:', requiredRole);
    return <Navigate to="/unknown-role" replace />;
  }

  // Handle role-based redirects for root path
  if (!requiredRole && window.location.pathname === "/") {
    console.log('🔄 ProtectedRoute: Performing role-based redirect');
    console.log('  - User role:', userProfile.role);
    
    switch (userProfile.role) {
      case "super_admin":
        console.log('✅ Redirecting super_admin to /super-admin');
        return <Navigate to="/super-admin" replace />;
      case "operator":
        console.log('✅ Redirecting operator to /operator');
        return <Navigate to="/operator" replace />;
      case "resident":
        console.log('✅ Redirecting resident to /discovery');
        return <Navigate to="/discovery" replace />;
      case "prospect":
        console.log('✅ Redirecting prospect to /discovery');
        return <Navigate to="/discovery" replace />;
      case "vendor":
        console.log('✅ Redirecting vendor to /maintenance');
        return <Navigate to="/maintenance" replace />;
      case "maintenance":
        console.log('✅ Redirecting maintenance to /maintenance');
        return <Navigate to="/maintenance" replace />;
      default:
        console.log('❓ Unknown role, redirecting to /unknown-role');
        return <Navigate to="/unknown-role" replace />;
    }
  }

  console.log('✅ ProtectedRoute: Access granted');
  return <>{children}</>;
};

export default ProtectedRoute;
