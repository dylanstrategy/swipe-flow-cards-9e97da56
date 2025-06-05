
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Redirects unauthenticated users to /login unless in dev or impersonation mode.
 * Returns:
 * - `true` if the user is allowed to view the page
 * - `false` if waiting for auth
 */
export function useProtectedRoute(): boolean {
  const navigate = useNavigate();
  const { user, userProfile, loading, isDevMode, isImpersonating } = useAuth();

  const isAllowed = isDevMode || isImpersonating || (!!user && !!userProfile);

  useEffect(() => {
    if (!loading && !isAllowed) {
      console.log('🔐 Not authenticated — redirecting to /login');
      navigate('/login');
    }
  }, [loading, isAllowed, navigate]);

  return isAllowed || loading;
}
