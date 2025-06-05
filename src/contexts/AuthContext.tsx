import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session, User } from '@supabase/supabase-js';
import type { AppRole } from '@/types/supabase';

// Define UserProfile type here since it's not exported from types
interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: AppRole;
  phone?: string;
  created_at: string;
  updated_at: string;
}

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
  signInWithEmail: (email: string, password: string) => Promise<any>;
  signUpWithEmail: (email: string, password: string, metadata?: any) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  // Dev mode additions
  isDevMode: boolean;
  devModeRole: AppRole | null;
  devModeProperty: string | null;
  enterDevMode: (role: AppRole, propertyId?: string) => void;
  exitDevMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [impersonatedRole, setImpersonatedRole] = useState<AppRole | null>(null);
  const [impersonatedUser, setImpersonatedUser] = useState<UserProfile | null>(null);
  
  // Dev mode state
  const [isDevMode, setIsDevMode] = useState(false);
  const [devModeRole, setDevModeRole] = useState<AppRole | null>(null);
  const [devModeProperty, setDevModeProperty] = useState<string | null>(null);

  const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
    console.log('👤 Fetching user profile for:', userId);
    try {
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Error fetching profile:', error);
        return null;
      } else {
        console.log('👤 User profile fetched:', profile);
        return profile as UserProfile;
      }
    } catch (err) {
      console.error('🔥 Error fetching profile:', err);
      return null;
    }
  };

  useEffect(() => {
    console.log('🔄 AuthProvider useEffect triggered');
    
    let mounted = true;

    // Get initial session first
    const getInitialAuth = async () => {
      try {
        console.log('🔑 Getting initial session');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted) {
          console.log('🔑 Initial session:', session ? 'found' : 'none');
          setUser(session?.user ?? null);
          
          if (session?.user) {
            console.log('👤 Fetching profile for initial user:', session.user.id);
            const profile = await fetchProfile(session.user.id);
            if (mounted && profile) {
              setUserProfile(profile);
            }
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('🔥 Error during auth initialization:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('👂 Auth state change event:', event, 'Session:', session ? 'present' : 'none');
        
        if (!mounted) return;

        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('👤 Auth state change - fetching profile for:', session.user.id);
          try {
            const profile = await fetchProfile(session.user.id);
            if (mounted && profile) {
              setUserProfile(profile);
            } else if (mounted) {
              setUserProfile(null);
            }
          } catch (error) {
            console.error('❌ Error fetching profile in auth state change:', error);
            if (mounted) {
              setUserProfile(null);
            }
          }
        } else {
          setUserProfile(null);
          setIsDevMode(false);
          setDevModeRole(null);
          setDevModeProperty(null);
        }
        
        if (mounted) {
          setLoading(false);
        }
      }
    );

    getInitialAuth();

    return () => {
      mounted = false;
      console.log('🧹 AuthProvider useEffect cleanup');
      subscription?.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    console.log('🔑 Signing in with email:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signUpWithEmail = async (email: string, password: string, metadata?: any) => {
    console.log('📝 Signing up with email:', email);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/`
      }
    });
    if (error) throw error;
    return data;
  };

  const signInWithGoogle = async () => {
    console.log('🔑 Signing in with Google');
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    console.log('🚪 Signing out...');
    try {
      await supabase.auth.signOut();
      console.log('🚪 Sign out successful');
      setUser(null);
      setUserProfile(null);
      setIsDevMode(false);
      setDevModeRole(null);
      setDevModeProperty(null);
    } catch (error) {
      console.error('❌ Error signing out:', error);
    }
  };

  const refreshProfile = async () => {
    console.log('🔄 Refreshing profile...');
    if (user) {
      const profile = await fetchProfile(user.id);
      setUserProfile(profile);
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

  // Dev mode functions
  const enterDevMode = (role: AppRole, propertyId?: string) => {
    console.log('🔧 Entering dev mode:', { role, propertyId });
    setIsDevMode(true);
    setDevModeRole(role);
    setDevModeProperty(propertyId || null);
  };

  const exitDevMode = () => {
    console.log('🔧 Exiting dev mode');
    setIsDevMode(false);
    setDevModeRole(null);
    setDevModeProperty(null);
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
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    isDevMode,
    devModeRole,
    devModeProperty,
    enterDevMode,
    exitDevMode,
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
