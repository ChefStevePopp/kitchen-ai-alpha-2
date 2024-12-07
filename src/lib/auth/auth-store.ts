import { create } from 'zustand';
import { authClient } from './auth-client';
import { handleAuthError } from './auth-errors';
import { initializeUserOrganization } from './auth-utils';
import type { User } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isDev: boolean;
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  error: null,
  isDev: false,

  initialize: async () => {
    try {
      const { data: { session }, error } = await authClient.auth.getSession();
      if (error) throw error;

      if (session?.user) {
        const isDev = session.user.email === 'office@memphisfirebbq.com';
        set({ user: session.user, isDev, error: null });
      }
    } catch (error) {
      handleAuthError(error, 'initialize auth');
    } finally {
      set({ isLoading: false });
    }

    // Listen for auth changes
    const { data: { subscription } } = authClient.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const isDev = session.user.email === 'office@memphisfirebbq.com';
        set({ user: session.user, isDev, error: null });
      } else {
        set({ user: null, isDev: false });
      }
      set({ isLoading: false });
    });

    return () => {
      subscription.unsubscribe();
    };
  },

  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await authClient.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password.trim()
      });

      if (error) throw error;
      if (!data.user) throw new Error('No user data returned');

      // Initialize organization if needed
      await initializeUserOrganization(data.user.id, data.user.email || '');

      const isDev = data.user.email === 'office@memphisfirebbq.com';
      set({ user: data.user, isDev, error: null });
      toast.success('Signed in successfully');
    } catch (error) {
      handleAuthError(error, 'sign in');
      throw error;
    }
  },

  signOut: async () => {
    try {
      const { error } = await authClient.auth.signOut();
      if (error) throw error;
      set({ user: null, isDev: false });
      toast.success('Signed out successfully');
    } catch (error) {
      handleAuthError(error, 'sign out');
      throw error;
    }
  }
}));

// Initialize auth on app load
useAuthStore.getState().initialize();