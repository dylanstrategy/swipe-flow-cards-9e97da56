
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
  signUpWithEmail: (email: string, password: string, userData: any) => Promise<void>;
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
  const [loading, setLoading] = useState(true);
  const [impersonatedRole, setImpersonatedRole] = useState<AppRole | null>(null);
  const { toast } = useToast();

  const isImpersonating = impersonatedRole !== null;
  const canImpersonate = userProfile?.role === 'super_admin';

  const fetchUserProfile = async (userId: string): Promise<AppUser | null> => {
    try {
      console.log('📋 Fetching user profile for:', userId);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('❌ Error fetching user profile:', error);
        return null;
      }
      
      console.log('✅ User profile fetched:', data);
      return data as AppUser;
    } catch (error) {
      console.error('❌ Error in fetchUserProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    console.log('🚀 AuthProvider initializing...');
    
    let mounted = true;

    // Initialize auth state
    const initializeAuth = async () => {
      try {
        console.log('📍 Getting initial session...');
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting session:', error);
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        console.log('📍 Initial session check:', !!currentSession);
        
        if (currentSession?.user && mounted) {
          console.log('👤 Found existing session for:', currentSession.user.email);
          setSession(currentSession);
          setUser(currentSession.user);
          
          // Fetch user profile
          const profile = await fetchUserProfile(currentSession.user.id);
          
          if (mounted) {
            setUserProfile(profile);
            console.log('✅ Session and profile loaded. Setting loading to false.');
            setLoading(false);
          }
        } else {
          console.log('🚫 No existing session found');
          if (mounted) {
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Set up auth state listener (but don't set loading here)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔔 Auth state change:', event, 'Session exists:', !!session);
        
        if (!mounted) return;
        
        // Only handle auth state changes, don't interfere with initial loading
        if (event === 'SIGNED_IN' && session) {
          console.log('✅ User signed in via auth state change:', session.user.email);
          setSession(session);
          setUser(session.user);
          
          // Fetch profile for new sign-ins
          const profile = await fetchUserProfile(session.user.id);
          if (mounted) {
            setUserProfile(profile);
            // Only set loading false if we're currently loading
            if (loading) {
              console.log('✅ New sign-in complete. Setting loading to false.');
              setLoading(false);
            }
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('🚫 User signed out');
          setSession(null);
          setUser(null);
          setUserProfile(null);
          setImpersonatedRole(null);
          // Don't set loading false on sign out
        } else if (event === 'TOKEN_REFRESHED' && session) {
          console.log('🔄 Token refreshed');
          setSession(session);
          setUser(session.user);
        }
      }
    );

    // Initialize auth
    initializeAuth();

    return () => {
      mounted = false;
      console.log('🧹 Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []); // Remove loading from dependency array to prevent loops

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
        throw error;
      }
    } catch (error: any) {
      setLoading(false);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string, userData: any) => {
    try {
      setLoading(true);

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) {
        throw error;
      }
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

  // Add console logs for debugging
  console.log('🔍 AuthContext state:', {
    hasUser: !!user,
    hasSession: !!session,
    hasProfile: !!userProfile,
    loading,
    userEmail: user?.email,
    profileRole: userProfile?.role
  });

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
