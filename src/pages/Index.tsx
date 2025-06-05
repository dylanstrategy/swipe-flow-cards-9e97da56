
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { userProfile } = useAuth();

  // This page should only be reached by residents via ProtectedRoute
  // The routing logic is now handled in ProtectedRoute component
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome Home!</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">
            Welcome to your resident portal, {userProfile?.first_name}!
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This is where residents can access their home information, submit requests, and more.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
