/**
 * Authentication Context
 * Provides user authentication state and methods using Supabase Auth
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, BusinessType } from '@/types';
import { supabase } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (username: string, password: string, email?: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateBusinessType: (businessType: BusinessType) => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔍 Checking existing session:', session ? 'Found' : 'None');
      if (session?.user) {
        console.log('👤 Loading profile for user:', session.user.email);
        loadUserProfile(session.user);
      } else {
        console.log('❌ No existing session found');
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Auth state change:', event, session ? 'Session exists' : 'No session');
      if (session?.user) {
        loadUserProfile(session.user);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (authUser: SupabaseUser) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading profile:', error);
        setIsLoading(false);
        return;
      }

      if (profile) {
        setUser({
          id: profile.id,
          username: profile.username,
          role: profile.role as UserRole,
          businessType: profile.business_type as BusinessType | undefined,
          createdAt: profile.created_at,
          password: '', // Not stored in Supabase
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('🔐 Login attempt for username:', username);
      
      // Special case for admin - bypass Supabase Auth
      if (username.toLowerCase() === 'admin' && password === 'admin123') {
        console.log('👑 Admin login detected, bypassing Supabase Auth');
        
        // Check if admin profile exists
        const { data: adminProfile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', 'admin')
          .eq('role', 'admin')
          .maybeSingle();

        if (profileError) {
          console.error('❌ Error checking admin profile:', profileError);
          return { success: false, error: 'Admin profile not found' };
        }

        if (adminProfile) {
          console.log('✅ Admin profile found, logging in directly');
          // Set admin user directly without Supabase Auth
          setUser({
            id: adminProfile.id,
            username: adminProfile.username,
            role: adminProfile.role as UserRole,
            businessType: adminProfile.business_type as BusinessType | undefined,
            createdAt: adminProfile.created_at,
            password: '', // Not stored
          });
          setIsLoading(false);
          return { success: true };
        } else {
          console.error('❌ Admin profile not found in database');
          return { success: false, error: 'Admin account not found. Please run the admin creation SQL.' };
        }
      }

      // Regular user login through Supabase Auth
      console.log('👤 Regular user login, using Supabase Auth');
      const email = `${username.toLowerCase()}@thanvitrader.local`;
      console.log('📧 Converting username to email:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Supabase Auth error:', error);
        return { success: false, error: 'Invalid username or password' };
      }

      if (data.user) {
        console.log('✅ Supabase Auth successful, loading profile');
        await loadUserProfile(data.user);
        return { success: true };
      }

      return { success: false, error: 'Login failed' };
    } catch (error) {
      console.error('❌ Login error:', error);
      return { success: false, error: 'An error occurred during login' };
    }
  };

  const signup = async (username: string, password: string, email?: string, role: UserRole = 'customer'): Promise<{ success: boolean; error?: string }> => {
    try {
      if (username.length < 3) {
        return { success: false, error: 'Username must be at least 3 characters' };
      }

      if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' };
      }

      // Check if username already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();

      if (existingProfile) {
        return { success: false, error: 'Username already exists' };
      }

      // Use provided email or convert username to email format for Supabase Auth
      const authEmail = email || `${username.toLowerCase()}@thanvitrader.local`;

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: authEmail,
        password,
      });

      if (authError) {
        return { success: false, error: authError.message };
      }

      if (!authData.user) {
        return { success: false, error: 'Signup failed' };
      }

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          username,
          role,
          email: email || null, // Store real email if provided
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        return { success: false, error: 'Failed to create profile' };
      }

      await loadUserProfile(authData.user);
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'An error occurred during signup' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateBusinessType = async (businessType: BusinessType) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ business_type: businessType })
        .eq('id', user.id);

      if (error) throw error;

      setUser({ ...user, businessType });
    } catch (error) {
      console.error('Error updating business type:', error);
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateBusinessType, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
