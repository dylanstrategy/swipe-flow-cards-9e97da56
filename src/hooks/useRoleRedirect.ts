
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const useRoleRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile, loading } = useAuth();

  // Disable role-based redirects - let users access any page
  useEffect(() => {
    console.log('🔄 Role redirect disabled - allowing access to:', location.pathname);
  }, [location.pathname]);

  return { userProfile, loading: false };
};
