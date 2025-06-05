
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { userProfile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!userProfile) {
      console.log('No profile found, redirecting to login');
      navigate('/login');
      return;
    }

    const role = userProfile.role;

    // Only redirect non-residents away from the base route
    if (role === 'super_admin') navigate('/super-admin');
    else if (role === 'operator') navigate('/operator');
    // Residents stay on "/" (this is the resident portal)
    else if (role !== 'resident') navigate('/unknown-role'); // fallback for invalid roles
  }, [userProfile, loading, navigate]);

  // If we're here and have a resident profile, show the resident portal
  if (userProfile?.role === 'resident') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome Home!</h1>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">
              Welcome to your resident portal, {userProfile.first_name}!
            </p>
            <p className="text-sm text-gray-500 mt-2">
              This is where residents can access their home information, submit requests, and more.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Index;
