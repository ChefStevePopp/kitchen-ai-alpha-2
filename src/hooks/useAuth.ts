import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!mounted) return;
      
      if (error) {
        console.error('Session error:', error);
        setUser(null);
      } else if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password.trim()
      });

      if (error) throw error;
      if (!data.user) throw new Error('No user data returned');

      toast.success('Signed in successfully');
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('Invalid email or password');
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  }, []);

  // Get display name from metadata
  const displayName = user ? `${user.user_metadata?.firstName || ''} ${user.user_metadata?.lastName || ''}`.trim() : '';

  // Check if user has dev system role
  const isDev = Boolean(
    user?.user_metadata?.system_role === 'dev' || 
    user?.user_metadata?.role === 'dev'
  );

  // Check if user has admin access
  const hasAdminAccess = Boolean(
    isDev || 
    user?.user_metadata?.role === 'owner' || 
    user?.user_metadata?.role === 'admin'
  );

  return {
    user,
    displayName,
    isLoading,
    isDev,
    hasAdminAccess,
    signIn,
    signOut
  };
}