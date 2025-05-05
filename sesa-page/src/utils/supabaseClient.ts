// src/utils/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Error: Missing Supabase URL or Anon Key. Please check your environment variables.');
}

// Create typed Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);