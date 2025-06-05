import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/users';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<{ needsConfirmation: boolean }>;
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
          // Wait a moment for the trigger to create the profile
          if (event === 'SIGNED_IN') {
            setTimeout(() => {
              loadUserProfile(session.user.id);
            }, 1000);
          } else {
            await loadUserProfile(session.user.id);
          }
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
        // Convert database format to UserProfile type
        const userProfile: UserProfile = {
          id: data.id,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone || '',
          role: data.role as any,
          permissions: [], // Will be populated based on role
          contactInfo: {
            email: data.email,
            phone: data.phone || '',
          },
          status: data.status as 'active' | 'inactive',
          createdAt: new Date(data.created_at),
          lastLogin: data.last_login ? new Date(data.last_login) : undefined
        };
        setUserProfile(userProfile);
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
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Network or other error during sign in:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    console.log('Signing up:', email, userData);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
            role: userData.role,
            property: userData.property || '',
          }
        }
      });
      
      if (error) {
        console.error('Sign up error:', error);
        throw error;
      }

      console.log('Sign up response data:', data);
      
      // Check if user was created but needs email confirmation
      if (data.user && !data.session) {
        console.log('User created but needs email confirmation');
        return { needsConfirmation: true };
      }
      
      // User was created and automatically signed in
      console.log('User created and automatically signed in');
      return { needsConfirmation: false };
      
    } catch (error) {
      console.error('Sign up failed:', error);
      throw error;
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
