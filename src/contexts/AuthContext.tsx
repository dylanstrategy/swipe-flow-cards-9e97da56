import React, { createContext, useState, useEffect, useContext } from 'react';
import { useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';
import type { Session, User } from '@supabase/supabase-js';
import type { AppRole } from '@/types/supabase';
import type { UserProfile } from '@/types/supabase';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  canImpersonate: boolean;
  isImpersonating: boolean;
  impersonatedRole: AppRole | null;
  impersonatedUser: UserProfile | null;
  impersonateRole: (role: AppRole) => void;
  impersonateAsUser: (user: UserProfile, role: AppRole) => void;
  stopImpersonation: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [impersonatedRole, setImpersonatedRole] = useState<AppRole | null>(null);
  const [impersonatedUser, setImpersonatedUser] = useState<UserProfile | null>(null);

  const supabase = useSupabaseClient();
  const { session } = useSessionContext();

  useEffect(() => {
    console.log('🔄 AuthProvider useEffect triggered');
    setLoading(true);

    const fetchSession = async () => {
      console.log('🔑 Session from useSessionContext:', session);
      setUser(session?.user || null);
    };

    const fetchProfile = async () => {
      if (session?.user) {
        console.log('👤 Fetching user profile...');
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('❌ Error fetching profile:', error);
          } else {
            console.log('👤 User profile fetched:', profile);
            setUserProfile(profile as UserProfile);
          }
        } catch (err) {
          console.error('🔥 Error fetching profile:', err);
        } finally {
          setLoading(false);
        }
      } else {
        console.log('🚫 No user session, clearing profile');
        setUserProfile(null);
        setLoading(false);
      }
    };

    fetchSession();
    fetchProfile();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('👂 Auth state change event:', event);
        setUser(session?.user || null);
        await fetchProfile();
      }
    );

    return () => {
      console.log('🧹 AuthProvider useEffect cleanup');
      subscription?.unsubscribe();
    };
  }, [session, supabase]);

  const signOut = async () => {
    console.log('🚪 Signing out...');
    try {
      await supabase.auth.signOut();
      console.log('🚪 Sign out successful');
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('❌ Error signing out:', error);
    }
  };

  const refreshProfile = async () => {
    console.log('🔄 Refreshing profile...');
    if (session?.user) {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('❌ Error refreshing profile:', error);
        } else {
          console.log('👤 Profile refreshed:', profile);
          setUserProfile(profile as UserProfile);
        }
      } catch (err) {
        console.error('🔥 Error refreshing profile:', err);
      }
    } else {
      console.log('🚫 No user session, cannot refresh profile');
    }
  };

  const impersonateRole = (role: AppRole) => {
    console.log('🎭 Starting role impersonation:', role);
    setIsImpersonating(true);
    setImpersonatedRole(role);
    setImpersonatedUser(null); // Clear any user-specific impersonation
  };

  const impersonateAsUser = (user: UserProfile, role: AppRole) => {
    console.log('🎭 Starting user impersonation:', { user: user.email, role });
    setIsImpersonating(true);
    setImpersonatedRole(role);
    setImpersonatedUser(user);
  };

  const stopImpersonation = () => {
    console.log('🎭 Stopping impersonation');
    setIsImpersonating(false);
    setImpersonatedRole(null);
    setImpersonatedUser(null);
  };

  const canImpersonate = userProfile?.role === 'super_admin';

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signOut,
    refreshProfile,
    canImpersonate,
    isImpersonating,
    impersonatedRole,
    impersonatedUser,
    impersonateRole,
    impersonateAsUser,
    stopImpersonation,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
