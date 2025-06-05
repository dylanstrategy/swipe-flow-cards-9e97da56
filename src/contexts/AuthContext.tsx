
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from '@supabase/supabase-js';
import type { AppRole } from '@/types/supabase';

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
  // Impersonation features
  canImpersonate: boolean;
  isImpersonating: boolean;
  impersonatedRole: AppRole | null;
  impersonatedUser: UserProfile | null;
  impersonateRole: (role: AppRole) => void;
  impersonateAsUser: (user: UserProfile, role: AppRole) => void;
  stopImpersonation: () => void;
  // Dev mode features
  isDevMode: boolean;
  devModeRole: AppRole | null;
  enterDevMode: (role: AppRole, propertyId?: string) => void;
  exitDevMode: () => void;
  // Auth methods
  signOut: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<any>;
  signUpWithEmail: (email: string, password: string, metadata?: any) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Impersonation state
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [impersonatedRole, setImpersonatedRole] = useState<AppRole | null>(null);
  const [impersonatedUser, setImpersonatedUser] = useState<UserProfile | null>(null);
  
  // Dev mode state
  const [isDevMode, setIsDevMode] = useState(false);
  const [devModeRole, setDevModeRole] = useState<AppRole | null>(null);

  const canImpersonate = userProfile?.role === 'super_admin';

  const fetchUserProfile = async (userId: string) => {
    console.log('Fetching user profile for:', userId);
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      console.log('User profile fetched:', data);
      return data;
    } catch (error) {
      console.error('Exception fetching user profile:', error);
      return null;
    }
  };

  useEffect(() => {
    console.log('AuthContext initializing...');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.email);
      
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Defer profile fetch to avoid blocking
        setTimeout(async () => {
          const profile = await fetchUserProfile(session.user.id);
          setUserProfile(profile);
          setLoading(false);
        }, 0);
      } else {
        setUserProfile(null);
        setIsImpersonating(false);
        setImpersonatedRole(null);
        setImpersonatedUser(null);
        setIsDevMode(false);
        setDevModeRole(null);
        setLoading(false);
      }
    });

    // Check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Initial session check:', session?.user?.email);
        
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          setUser(session.user);
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => subscription?.unsubscribe();
  }, []);

  const signOut = async () => {
    console.log('Signing out...');
    await supabase.auth.signOut();
    setUser(null);
    setUserProfile(null);
    setIsImpersonating(false);
    setImpersonatedRole(null);
    setImpersonatedUser(null);
    setIsDevMode(false);
    setDevModeRole(null);
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signUpWithEmail = async (email: string, password: string, metadata?: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/login`
      }
    });
    if (error) throw error;
    
    // Check if email confirmation is needed
    const needsConfirmation = !data.session && data.user && !data.user.email_confirmed_at;
    
    return { 
      ...data, 
      needsConfirmation 
    };
  };

  const impersonateRole = (role: AppRole) => {
    console.log('🎭 Impersonating role:', role);
    setIsImpersonating(true);
    setImpersonatedRole(role);
    setImpersonatedUser(null);
    setIsDevMode(false);
    setDevModeRole(null);
  };

  const impersonateAsUser = (user: UserProfile, role: AppRole) => {
    console.log('🎭 Impersonating user:', user.email, 'as role:', role);
    setIsImpersonating(true);
    setImpersonatedRole(role);
    setImpersonatedUser(user);
    setIsDevMode(false);
    setDevModeRole(null);
  };

  const stopImpersonation = () => {
    console.log('🎭 Stopping impersonation');
    setIsImpersonating(false);
    setImpersonatedRole(null);
    setImpersonatedUser(null);
  };

  const enterDevMode = (role: AppRole, propertyId?: string) => {
    console.log('🔧 Entering dev mode as role:', role, 'property:', propertyId);
    setIsDevMode(true);
    setDevModeRole(role);
    setIsImpersonating(false);
    setImpersonatedRole(null);
    setImpersonatedUser(null);
  };

  const exitDevMode = () => {
    console.log('🔧 Exiting dev mode');
    setIsDevMode(false);
    setDevModeRole(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userProfile, 
      loading,
      canImpersonate,
      isImpersonating,
      impersonatedRole,
      impersonatedUser,
      impersonateRole,
      impersonateAsUser,
      stopImpersonation,
      isDevMode,
      devModeRole,
      enterDevMode,
      exitDevMode,
      signOut,
      signInWithEmail,
      signUpWithEmail
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
