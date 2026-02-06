import { createClient } from '@supabase/supabase-js';

// ต้องใช้ import.meta.env เท่านั้นสำหรับ Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing! Check Vercel Environment Variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
