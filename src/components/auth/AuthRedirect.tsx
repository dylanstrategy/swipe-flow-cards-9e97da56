
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { AppRole } from '@/types/supabase';
import type { Session } from '@supabase/supabase-js';

const ROLE_REDIRECTS: Record<AppRole, string> = {
  'super_admin': '/super-admin',
  'senior_operator': '/operator',
  'operator': '/operator',
  'maintenance': '/maintenance',
  'leasing': '/operator',
  'prospect': '/',
  'resident': '/resident',
  'former_resident': '/resident',
  'vendor': '/maintenance'
};

const SUPER_ADMIN_EMAIL = 'info@applaudliving.com';

interface AuthRedirectProps {
  session: Session | null;
}

export default function AuthRedirect({ session }: AuthRedirectProps) {
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfileAndRedirect() {
      if (!session?.user) return;

      const user = session.user;

      // Check for super admin email first
      if (user.email === SUPER_ADMIN_EMAIL) {
        navigate('/super-admin');
        return;
      }

      // Fetch user profile from the users table
      const { data: userProfile, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error || !userProfile) {
        console.error('Error fetching user profile:', error);
        // Default redirect if no profile found
        navigate('/');
        return;
      }

      const redirectPath = ROLE_REDIRECTS[userProfile.role];
      if (redirectPath) {
        navigate(redirectPath);
      } else {
        console.warn('Unrecognized role:', userProfile.role);
        navigate('/');
      }
    }

    if (session) {
      fetchProfileAndRedirect();
    }
  }, [session, navigate]);

  return null;
}
