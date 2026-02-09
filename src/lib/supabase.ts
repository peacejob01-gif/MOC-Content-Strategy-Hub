import { createClient } from '@supabase/supabase-js';

// โค้ดนี้จะดึงค่าจาก Environment Variables ที่เราตั้งไว้ใน Vercel
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
