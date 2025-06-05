
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

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      if (session?.user) {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (!error) setUserProfile(data);
      }

      setLoading(false);
    };

    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        setUserProfile(null);
        setIsImpersonating(false);
        setImpersonatedRole(null);
        setImpersonatedUser(null);
        setIsDevMode(false);
        setDevModeRole(null);
      } else {
        // Fetch user profile when session changes
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (!error) setUserProfile(data);
      }
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
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
