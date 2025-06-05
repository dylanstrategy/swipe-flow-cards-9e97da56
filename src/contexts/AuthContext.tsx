
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { User as AppUser, AppRole } from '@/types/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: AppUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, userData: any) => Promise<{ needsConfirmation?: boolean }>;
  signOut: () => Promise<void>;
  impersonateRole: (role: AppRole) => void;
  stopImpersonation: () => void;
  isImpersonating: boolean;
  impersonatedRole: AppRole | null;
  canImpersonate: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true); // Start with true
  const [impersonatedRole, setImpersonatedRole] = useState<AppRole | null>(null);
  const { toast } = useToast();

  const isImpersonating = impersonatedRole !== null;
  const canImpersonate = userProfile?.role === 'super_admin';

  // Function to fetch user profile from the database
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('🔍 Fetching user profile for:', userId);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('❌ Error fetching user profile:', error);
        setUserProfile(null);
        return;
      }

      if (data) {
        console.log('✅ User profile fetched:', data);
        setUserProfile(data);
      } else {
        console.log('⚠️ No user profile found for user:', userId);
        setUserProfile(null);
      }
    } catch (error) {
      console.error('❌ Exception fetching user profile:', error);
      setUserProfile(null);
    }
  };

  // Auth initialization and state management
  useEffect(() => {
    console.log('🚀 AuthProvider initializing...');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('🔍 Initial session check:', !!session, 'Error:', error);
      
      if (session?.user) {
        console.log('👤 Initial session found, fetching profile...');
        setSession(session);
        setUser(session.user);
        // Fetch profile for initial session
        fetchUserProfile(session.user.id).finally(() => {
          setLoading(false);
        });
      } else {
        console.log('🚫 No initial session found');
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔔 Auth state change:', event, 'Session:', !!session);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('👤 User signed in, fetching profile...');
          setLoading(true); // Set loading while fetching profile
          await fetchUserProfile(session.user.id);
          setLoading(false); // Only set false AFTER profile is fetched
        } else {
          console.log('🚫 User signed out, clearing profile...');
          setUserProfile(null);
          setImpersonatedRole(null);
          setLoading(false); // Set false after clearing profile
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      console.log('🔄 Starting Google sign in...');
      setLoading(true);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        }
      });
      
      if (error) {
        console.error('❌ Google sign in error:', error);
        setLoading(false);
        throw error;
      }
      
      console.log('✅ Google sign in initiated');
      // Don't set loading to false here - let the auth state change handler do it
    } catch (error: any) {
      console.error('❌ Google sign in error:', error);
      setLoading(false);
      toast({
        title: "Authentication Error",
        description: error.message || "Failed to sign in with Google",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoading(false);
        throw error;
      }
      
      // Don't set loading to false here - let the auth state change handler do it
    } catch (error: any) {
      setLoading(false);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string, userData: any) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) {
        setLoading(false);
        throw error;
      }

      // Don't set loading to false here - let the auth state change handler do it
      return {
        needsConfirmation: !data.session && !!data.user
      };
    } catch (error: any) {
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('🔄 Signing out...');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setImpersonatedRole(null);
      console.log('✅ Signed out successfully');
    } catch (error: any) {
      console.error('❌ Sign out error:', error);
      toast({
        title: "Sign Out Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const impersonateRole = (role: AppRole) => {
    if (!canImpersonate) {
      toast({
        title: "Permission Denied",
        description: "Only super admins can impersonate roles",
        variant: "destructive",
      });
      return;
    }
    setImpersonatedRole(role);
    toast({
      title: "Role Switched",
      description: `Now viewing as ${role.replace('_', ' ')}`,
    });
  };

  const stopImpersonation = () => {
    setImpersonatedRole(null);
    toast({
      title: "Impersonation Stopped",
      description: "Returned to your original role",
    });
  };

  const effectiveRole = impersonatedRole || userProfile?.role;

  const value = {
    user,
    session,
    userProfile: userProfile ? { ...userProfile, role: effectiveRole || userProfile.role } : null,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    impersonateRole,
    stopImpersonation,
    isImpersonating,
    impersonatedRole,
    canImpersonate,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
