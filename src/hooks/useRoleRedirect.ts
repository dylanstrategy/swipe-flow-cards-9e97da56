
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const useRoleRedirect = () => {
  const navigate = useNavigate();
  const { userProfile, loading } = useAuth();

  useEffect(() => {
    if (loading || !userProfile) return;

    const role = userProfile.role;
    console.log('🔄 Role-based redirect for role:', role);

    switch (role) {
      case 'super_admin':
        console.log('🚀 Redirecting super admin to /super-admin');
        navigate('/super-admin', { replace: true });
        break;
      case 'operator':
        console.log('👨‍💼 Redirecting operator to /operator');
        navigate('/operator', { replace: true });
        break;
      case 'resident':
        console.log('🏠 Redirecting resident to /');
        navigate('/', { replace: true });
        break;
      default:
        console.log('❓ Unknown role, redirecting to /unknown-role');
        navigate('/unknown-role', { replace: true });
        break;
    }
  }, [userProfile, loading, navigate]);

  return { userProfile, loading };
};
