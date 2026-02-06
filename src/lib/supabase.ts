import { createClient } from '@supabase/supabase-js';

// ใน Vite ต้องใช้ import.meta.env เท่านั้น
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ป้องกันหน้าขาวหากลืมใส่ Key
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase Keys! โปรดตั้งค่า Environment Variables ใน Vercel");
}

export const supabase = createClient(
  supabaseUrl || '', 
  supabaseAnonKey || ''
);
