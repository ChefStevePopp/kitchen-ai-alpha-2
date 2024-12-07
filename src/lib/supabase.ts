import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import toast from 'react-hot-toast';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create single client instance with proper configuration
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'kitchen-ai-auth'
  }
});

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  
  if (!navigator.onLine) {
    throw new Error('No internet connection. Please check your network and try again.');
  }

  if (error.message?.includes('JWT')) {
    throw new Error('Your session has expired. Please sign in again.');
  }

  if (error.code === 'PGRST204') {
    throw new Error('Database schema mismatch. Please contact support.');
  }

  if (error.code === '23505') {
    throw new Error('This record already exists.');
  }

  if (error.code?.startsWith('23')) {
    throw new Error('Invalid data provided.');
  }

  if (error.code === '42501') {
    throw new Error('You do not have permission to perform this action.');
  }

  throw new Error(error.message || 'An unexpected error occurred');
};

// Wrapper for Supabase queries with error handling
export const withErrorHandling = async <T,>(
  promise: Promise<{ data: T | null; error: any }>
): Promise<T> => {
  try {
    const { data, error } = await promise;
    if (error) throw error;
    if (!data) throw new Error('No data returned');
    return data;
  } catch (error) {
    handleSupabaseError(error);
    throw error;
  }
};