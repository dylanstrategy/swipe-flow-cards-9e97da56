import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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
  
  // Use refs to prevent multiple operations and track state
  const initializingRef = useRef(false);
  const currentUserIdRef = useRef<string | null>(null);
  const profileHandledRef = useRef(false);

  const isImpersonating = impersonatedRole !== null;
  const canImpersonate = userProfile?.role === 'super_admin';

  // Function to determine role based on email
  const determineRoleFromEmail = (email: string): AppRole => {
    if (email === 'info@applaudliving.com') {
      return 'super_admin';
    }
    if (email.endsWith('@applaudliving.com')) {
      return 'operator'; // Support team gets operator role
    }
    // Check for client domains (this would need to be expanded with actual client domains)
    if (email.includes('@client') || email.endsWith('.property.com')) {
      return 'operator';
    }
    // Check for vendor domains
    if (email.includes('@vendor') || email.includes('@contractor')) {
      return 'vendor';
    }
    // Public emails (Gmail, Yahoo, etc.) get resident role
    if (email.endsWith('@gmail.com') || email.endsWith('@yahoo.com') || 
        email.endsWith('@hotmail.com') || email.endsWith('@outlook.com')) {
      return 'resident';
    }
    // Default to prospect for new users
    return 'prospect';
  };

  // Function to fetch or create user profile
  const fetchOrCreateUserProfile = async (userId: string, email: string): Promise<AppUser | null> => {
    try {
      console.log('🔍 Fetching user profile for:', userId);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('❌ Error fetching user profile:', error);
        return null;
      }

      if (data) {
        console.log('✅ User profile found:', data);
        return data;
      } else {
        console.log('⚠️ No user profile found, creating new profile for:', email);
        
        // Determine role based on email
        const role = determineRoleFromEmail(email);
        
        // Create new user profile
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            id: userId,
            email: email,
            first_name: 'New',
            last_name: 'User',
            role: role
          })
          .select()
          .single();

        if (createError) {
          console.error('❌ Error creating user profile:', createError);
          return null;
        }

        console.log('✅ Created new user profile:', newUser);
        return newUser;
      }
    } catch (error) {
      console.error('❌ Exception fetching/creating user profile:', error);
      return null;
    }
  };

  // Handle auth state changes
  const handleAuthStateChange = async (event: string, session: Session | null) => {
    console.log('🔔 Auth state change:', event, 'Session:', !!session);
    
    // Prevent multiple simultaneous initializations
    if (initializingRef.current) {
      console.log('⏳ Auth initialization already in progress, skipping...');
      return;
    }

    initializingRef.current = true;
    
    try {
      // Only update state if values have actually changed
      const newUserId = session?.user?.id || null;
      
      if (newUserId !== currentUserIdRef.current) {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('👤 User signed in, fetching/creating profile...');
          currentUserIdRef.current = session.user.id;
          profileHandledRef.current = false;
          
          const profile = await fetchOrCreateUserProfile(session.user.id, session.user.email || '');
          setUserProfile(profile);
          profileHandledRef.current = true;
        } else {
          console.log('🚫 User signed out, clearing profile...');
          setUserProfile(null);
          setImpersonatedRole(null);
          currentUserIdRef.current = null;
          profileHandledRef.current = false;
          
          // Clear localStorage on logout
          localStorage.removeItem('supabase.auth.token');
        }
      }
    } catch (error) {
      console.error('❌ Error handling auth state change:', error);
    } finally {
      // Only set loading to false after everything is resolved
      setLoading(false);
      initializingRef.current = false;
      console.log('✅ Auth initialization complete, loading set to false');
    }
  };

  // Auth initialization
  useEffect(() => {
    console.log('🚀 AuthProvider initializing...');
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('🔍 Initial session check:', !!session, 'Error:', error);
        
        if (!initializingRef.current) {
          await handleAuthStateChange('INITIAL_SESSION', session);
        }
      } catch (error) {
        console.error('❌ Error getting initial session:', error);
        setLoading(false);
        initializingRef.current = false;
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
      initializingRef.current = false;
    };
  }, []); // Empty dependency array is critical

  const signInWithGoogle = async () => {
    try {
      console.log('🔄 Starting Google sign in...');
      setLoading(true);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://preview--swipe-flow-cards.lovable.app',
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
      
      // Clear all state and localStorage
      setImpersonatedRole(null);
      currentUserIdRef.current = null;
      profileHandledRef.current = false;
      initializingRef.current = false;
      localStorage.removeItem('supabase.auth.token');
      
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
