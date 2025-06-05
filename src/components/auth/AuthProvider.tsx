
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/users';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
  switchRole: (newRole: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.email);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          setUserProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      console.log('Loading user profile for:', userId);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading user profile:', error);
      } else if (data) {
        console.log('User profile loaded:', data);
        setUserProfile(data);
      } else {
        console.log('No user profile found');
      }
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('Signing in:', email);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    console.log('Signing up:', email, userData);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.name,
          phone: userData.phone,
          role: userData.role,
        }
      }
    });
    
    if (error) {
      console.error('Sign up error:', error);
      throw error;
    }

    console.log('Sign up successful:', data);

    // The user profile will be created by the database trigger
    // But let's also manually create it to ensure it exists
    if (data.user) {
      console.log('Creating user profile manually for:', data.user.id);
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert([
          {
            id: data.user.id,
            email: email,
            name: userData.name,
            phone: userData.phone,
            role: userData.role,
            status: 'active',
          }
        ], {
          onConflict: 'id'
        });
      
      if (profileError) {
        console.error('Error creating user profile:', profileError);
        // Don't throw here as the trigger might have created it
      } else {
        console.log('User profile created successfully');
      }
    }
  };

  const signOut = async () => {
    console.log('Signing out');
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const switchRole = async (newRole: string) => {
    if (!user || !userProfile) return;

    console.log('Switching role to:', newRole);
    const { error } = await supabase
      .from('user_profiles')
      .update({ role: newRole })
      .eq('id', user.id);

    if (error) {
      console.error('Error switching role:', error);
      throw error;
    }

    // Reload profile to get updated role
    await loadUserProfile(user.id);
  };

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    switchRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
