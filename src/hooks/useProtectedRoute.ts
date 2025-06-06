
import { useState } from 'react';
import type { User } from '@supabase/supabase-js';

/**
 * Hook that no longer requires authentication - allows access to all routes
 */
export function useProtectedRoute(): { user: User | null; isLoading: boolean } {
  // Return a mock user and not loading to allow access to all routes
  const [user] = useState<User | null>({
    id: 'demo-user',
    email: 'demo@example.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    aud: 'authenticated',
    app_metadata: {},
    user_metadata: {},
  } as User);
  
  const [isLoading] = useState(false);

  return { user, isLoading };
}
