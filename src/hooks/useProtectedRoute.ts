
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

/**
 * Hook to protect routes that require authentication
 * Returns the user if authenticated, or redirects to register page
 */
export function useProtectedRoute(): { user: User | null; isLoading: boolean } {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate('/register');
          return;
        }
        
        setUser(user);
      } catch (error) {
        console.error('Error fetching user:', error);
        navigate('/register');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session?.user) {
        setUser(null);
        navigate('/register');
      } else {
        setUser(session.user);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return { user, isLoading };
}
