import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';

const Index = () => {
  const { user, userProfile } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Applaud</h1>
          <p className="text-gray-600">Property management made simple</p>
          {userProfile && (
            <p className="text-sm text-gray-500 mt-2">
              Logged in as {userProfile.first_name} {userProfile.last_name} ({userProfile.role})
            </p>
          )}
        </div>

        <div className="space-y-3">
          {userProfile?.role === 'super_admin' && (
            <Link 
              to="/super-admin" 
              className="block w-full bg-red-600 hover:bg-red-700 text-white text-center py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Super Admin Dashboard
            </Link>
          )}
          
          {(userProfile?.role === 'operator' || userProfile?.role === 'senior_operator') && (
            <Link 
              to="/operator" 
              className="block w-full bg-purple-600 hover:bg-purple-700 text-white text-center py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Operator Dashboard
            </Link>
          )}

          <Link 
            to="/discovery" 
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Find Your Home
          </Link>

          <Link 
            to="/matches" 
            className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-3 px-4 rounded-lg font-medium transition-colors"
          >
            View Matches
          </Link>

          <Link 
            to="/maintenance" 
            className="block w-full bg-orange-600 hover:bg-orange-700 text-white text-center py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Maintenance Requests
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
