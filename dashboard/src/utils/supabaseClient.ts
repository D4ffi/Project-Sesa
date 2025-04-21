import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('error: Missing Supabase URL or Anon Key');
}

// Create typed Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);