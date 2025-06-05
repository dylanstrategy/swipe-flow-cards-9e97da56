
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
  const [hasRedirected, setHasRedirected] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState<NodeJS.Timeout | null>(null);
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

  const getRoleBasedRedirect = (userProfile: AppUser): string => {
    // Special case for super admin email
    if (userProfile.email === 'info@applaudliving.com') {
      return '/super-admin';
    }
    
    // Role-based redirects
    switch (userProfile.role) {
      case 'super_admin':
        return '/super-admin';
      case 'senior_operator':
      case 'operator':
      case 'leasing':
        return '/operator';
      case 'maintenance':
        return '/maintenance';
      case 'resident':
        return '/';
      case 'prospect':
        return '/discovery';
      default:
        return '/unknown-role';
    }
  };

  const handlePostLoginRedirect = (userProfile: AppUser) => {
    const currentPath = window.location.pathname;
    
    // Only redirect if we're on a login page and haven't already redirected
    if ((currentPath === '/login' || currentPath === '/owner-login') && !hasRedirected) {
      console.log('Redirecting user with profile:', userProfile);
      setHasRedirected(true);
      
      const redirectPath = getRoleBasedRedirect(userProfile);
      console.log('Redirecting to:', redirectPath);
      
      // Use setTimeout to ensure state updates are complete
      setTimeout(() => {
        window.location.href = redirectPath;
      }, 100);
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

    setLoadingTimeout(timeout);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [loading, toast]);

  useEffect(() => {
    let mounted = true;
    let authSubscription: any = null;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        // Set up auth state listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted) return;

            console.log('Auth event:', event, session?.user?.email);
            
            // Clear loading timeout when we get an auth event
            if (loadingTimeout) {
              clearTimeout(loadingTimeout);
              setLoadingTimeout(null);
            }
            
            setSession(session);
            setUser(session?.user ?? null);
            
            if (session?.user && event === 'SIGNED_IN') {
              try {
                const profile = await fetchUserProfile(session.user.id);
                if (mounted && profile) {
                  setUserProfile(profile);
                  setLoading(false);
                  
                  // Handle redirect after profile is loaded
                  setTimeout(() => {
                    if (mounted) {
                      handlePostLoginRedirect(profile);
                    }
                  }, 200);
                } else if (mounted) {
                  setLoading(false);
                }
              } catch (error) {
                console.error('Error handling signed in user:', error);
                if (mounted) {
                  setLoading(false);
                }
              }
            } else if (!session) {
              if (mounted) {
                setUserProfile(null);
                setLoading(false);
                setHasRedirected(false);
              }
            }
          }
        );

        authSubscription = subscription;

        // Check for existing session after setting up listener
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        console.log('Existing session check:', existingSession?.user?.email);
        
        if (existingSession?.user) {
          setSession(existingSession);
          setUser(existingSession.user);
          
          const profile = await fetchUserProfile(existingSession.user.id);
          if (mounted && profile) {
            setUserProfile(profile);
            setLoading(false);
            
            // Handle redirect for existing session
            setTimeout(() => {
              if (mounted) {
                handlePostLoginRedirect(profile);
              }
            }, 200);
          } else if (mounted) {
            setLoading(false);
          }
        } else if (mounted) {
          setLoading(false);
        }
        
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
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
    };
  }, []); // Empty dependency array to run only once

  const signInWithGoogle = async () => {
    try {
      console.log('Starting Google sign in...');
      setLoading(true);
      setHasRedirected(false);
      
      const currentUrl = window.location.origin;
      const redirectTo = window.location.pathname === '/owner-login' 
        ? `${currentUrl}/owner-login`
        : `${currentUrl}/login`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
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
      setHasRedirected(false);
      
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
      setHasRedirected(false);
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
