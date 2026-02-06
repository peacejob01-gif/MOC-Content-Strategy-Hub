import { createClient } from '@supabase/supabase-js';

// เปลี่ยนมาใช้การดึงค่าแบบปลอดภัยสำหรับ Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
