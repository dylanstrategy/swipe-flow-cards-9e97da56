
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
  const [loading, setLoading] = useState(true);
  const [impersonatedRole, setImpersonatedRole] = useState<AppRole | null>(null);
  const { toast } = useToast();

  const isImpersonating = impersonatedRole !== null;
  const canImpersonate = userProfile?.role === 'super_admin';

  // Function to determine role based on email
  const determineRoleFromEmail = (email: string): AppRole => {
    console.log('Determining role for email:', email);
    
    if (email === 'info@applaudliving.com') {
      return 'super_admin';
    }
    if (email.endsWith('@applaudliving.com')) {
      return 'operator';
    }
    if (email.includes('@client') || email.endsWith('.property.com')) {
      return 'operator';
    }
    if (email.includes('@vendor') || email.includes('@contractor')) {
      return 'vendor';
    }
    if (email.endsWith('@gmail.com') || email.endsWith('@yahoo.com') || 
        email.endsWith('@hotmail.com') || email.endsWith('@outlook.com')) {
      return 'resident';
    }
    return 'prospect';
  };

  // Function to create user profile
  const createUserProfile = (userId: string, email: string): AppUser => {
    const role = determineRoleFromEmail(email);
    return {
      id: userId,
      email: email,
      first_name: 'New',
      last_name: 'User',
      role: role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  };

  // Handle auth state changes
  useEffect(() => {
    console.log('🚀 AuthProvider initializing...');
    
    let mounted = true;

    // Listen for auth changes first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔔 Auth state change:', event, 'Session exists:', !!session);
        
        if (!mounted) return;
        
        if (session?.user) {
          console.log('👤 User signed in, creating profile...');
          setSession(session);
          setUser(session.user);
          const profile = createUserProfile(session.user.id, session.user.email || '');
          setUserProfile(profile);
        } else {
          console.log('🚫 User signed out, clearing profile...');
          setSession(null);
          setUser(null);
          setUserProfile(null);
          setImpersonatedRole(null);
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('🔍 Initial session check:', !!session, 'Error:', error);
        
        if (!mounted) return;
        
        if (session?.user) {
          console.log('👤 User found in initial session');
          setSession(session);
          setUser(session.user);
          const profile = createUserProfile(session.user.id, session.user.email || '');
          setUserProfile(profile);
        } else {
          console.log('🚫 No user in initial session');
          setSession(null);
          setUser(null);
          setUserProfile(null);
        }
      } catch (error) {
        console.error('❌ Error getting initial session:', error);
      } finally {
        if (mounted) {
          setLoading(false);
          console.log('✅ Auth initialization complete');
        }
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      console.log('🔄 Starting Google sign in...');
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/login`,
        }
      });
      
      if (error) {
        console.error('❌ Google sign in error:', error);
        toast({
          title: "Authentication Error",
          description: error.message || "Failed to sign in with Google",
          variant: "destructive",
        });
        throw error;
      }
      
      console.log('✅ Google sign in initiated');
    } catch (error: any) {
      console.error('❌ Google sign in error:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      console.log('🔄 Starting email sign in for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Email sign in error:', error);
        toast({
          title: "Authentication Error",
          description: error.message || "Invalid email or password",
          variant: "destructive",
        });
        throw error;
      }
      
      console.log('✅ Email sign in successful:', data.user?.email);
      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully",
      });
    } catch (error: any) {
      console.error('❌ Email sign in error:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string, userData: any) => {
    try {
      console.log('🔄 Starting email sign up for:', email);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: window.location.origin
        }
      });

      if (error) {
        console.error('❌ Email sign up error:', error);
        toast({
          title: "Authentication Error",
          description: error.message || "Failed to create account",
          variant: "destructive",
        });
        throw error;
      }

      console.log('✅ Email sign up successful:', data);
      
      if (!data.session && data.user) {
        toast({
          title: "Check your email",
          description: "We've sent you a confirmation link",
        });
        return { needsConfirmation: true };
      } else {
        toast({
          title: "Account created!",
          description: "You have been signed up successfully",
        });
        return { needsConfirmation: false };
      }
    } catch (error: any) {
      console.error('❌ Email sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('🔄 Signing out...');
      
      // Clear impersonation state first
      setImpersonatedRole(null);
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log('✅ Signed out successfully');
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
      
      // Force redirect to login page
      window.location.href = '/login';
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
    
    console.log('🎭 Impersonating role:', role);
    setImpersonatedRole(role);
    toast({
      title: "Role Switched",
      description: `Now viewing as ${role.replace('_', ' ')}`,
    });
  };

  const stopImpersonation = () => {
    console.log('🎭 Stopping impersonation');
    setImpersonatedRole(null);
    toast({
      title: "Impersonation Stopped",
      description: "Returned to your original role",
    });
  };

  // Create the effective user profile with the impersonated role
  const effectiveUserProfile = userProfile ? {
    ...userProfile,
    role: impersonatedRole || userProfile.role
  } : null;

  const value = {
    user,
    session,
    userProfile: effectiveUserProfile,
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
