import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (_supabase) return _supabase;

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables. Blog features will be unavailable.');
    // Return a minimal mock to prevent crashes
    return createClient('https://placeholder.supabase.co', 'placeholder');
  }

  _supabase = createClient(supabaseUrl, supabaseAnonKey);
  return _supabase;
}

export const supabase = getSupabase();
