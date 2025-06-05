
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

  // Domain validation for operators
  const isValidOperatorDomain = (email: string): boolean => {
    const allowedDomains = ['@ironstate.com', '@applaudliving.com', '@meridian.com'];
    return allowedDomains.some(domain => email.endsWith(domain));
  };

  const fetchUserProfile = async (userId: string): Promise<AppUser | null> => {
    try {
      console.log('Fetching user profile for:', userId);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      console.log('User profile fetched:', data);
      return data as AppUser;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  // Set up loading timeout
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.error('Auth loading timeout reached');
        setLoading(false);
        toast({
          title: "Login Timeout",
          description: "Login is taking longer than expected. Please refresh or try again.",
          variant: "destructive",
        });
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, [loading, toast]);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        // Set up auth state listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted) return;

            console.log('Auth event:', event, 'User:', session?.user?.email, 'Session exists:', !!session);
            
            setSession(session);
            setUser(session?.user ?? null);
            
            if (session?.user) {
              // Use setTimeout to avoid blocking the auth state change
              setTimeout(async () => {
                if (!mounted) return;
                try {
                  const profile = await fetchUserProfile(session.user.id);
                  if (mounted && profile) {
                    setUserProfile(profile);
                  }
                } catch (error) {
                  console.error('Error handling signed in user:', error);
                }
                if (mounted) {
                  setLoading(false);
                }
              }, 0);
            } else {
              if (mounted) {
                setUserProfile(null);
                setLoading(false);
              }
            }
          }
        );

        // Check for existing session
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        console.log('Existing session check:', existingSession?.user?.email, 'Session exists:', !!existingSession);
        
        if (existingSession?.user) {
          setSession(existingSession);
          setUser(existingSession.user);
          
          try {
            const profile = await fetchUserProfile(existingSession.user.id);
            if (mounted && profile) {
              setUserProfile(profile);
            }
          } catch (error) {
            console.error('Error fetching existing user profile:', error);
          }
        }
        
        if (mounted) {
          setLoading(false);
        }

        return () => {
          subscription.unsubscribe();
        };
        
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      console.log('Starting Google sign in...');
      setLoading(true);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        }
      });
      
      if (error) {
        console.error('Google sign in error:', error);
        setLoading(false);
        throw error;
      }
      
      console.log('Google sign in initiated successfully');
    } catch (error: any) {
      console.error('Google sign in error:', error);
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
    } catch (error: any) {
      setLoading(false);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string, userData: any) => {
    try {
      setLoading(true);

      // Check domain restrictions for operators
      if (userData.role && ['operator', 'senior_operator', 'leasing', 'maintenance'].includes(userData.role)) {
        if (!isValidOperatorDomain(email)) {
          throw new Error('Registration is only allowed for authorized company emails.');
        }
      }

      const { error } = await supabase.auth.signUp({
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
    } catch (error: any) {
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setImpersonatedRole(null);
      window.location.href = '/login';
    } catch (error: any) {
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
