
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const useRoleRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile, loading } = useAuth();

  useEffect(() => {
    if (loading || !userProfile) return;
    
    // Don't redirect if we're already on the login page
    if (location.pathname === '/login') return;

    const role = userProfile.role;
    console.log('🔄 Role-based redirect for role:', role, 'current path:', location.pathname);

    // Only redirect if we're on a page that doesn't match the user's role
    switch (role) {
      case 'super_admin':
        if (location.pathname !== '/super-admin') {
          console.log('🚀 Redirecting super admin to /super-admin');
          navigate('/super-admin', { replace: true });
        }
        break;
      case 'operator':
        if (location.pathname !== '/operator') {
          console.log('👨‍💼 Redirecting operator to /operator');
          navigate('/operator', { replace: true });
        }
        break;
      case 'resident':
        if (location.pathname !== '/') {
          console.log('🏠 Redirecting resident to /');
          navigate('/', { replace: true });
        }
        break;
      default:
        if (location.pathname !== '/unknown-role') {
          console.log('❓ Unknown role, redirecting to /unknown-role');
          navigate('/unknown-role', { replace: true });
        }
        break;
    }
  }, [userProfile, loading, navigate, location.pathname]);

  return { userProfile, loading };
};
