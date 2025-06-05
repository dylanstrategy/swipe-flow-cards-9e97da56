
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

    if (role === 'super_admin') navigate('/super-admin');
    else if (role === 'operator') navigate('/operator');
    else if (role === 'resident') navigate('/movein');
    else navigate('/unknown-role'); // fallback for invalid roles
  }, [userProfile, loading, navigate]);

  return null;
};

export default Index;
