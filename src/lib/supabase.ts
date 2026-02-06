import { createClient } from '@supabase/supabase-js';

// ดึงค่าแบบ Vite-safe
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL |MOC-Content-Strategy-Hub| '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// ถ้าไม่มี Key ให้แจ้งเตือนใน Console แทนการทำเครื่องค้าง
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Supabase Config Missing: อย่าลืมใส่ Env ใน Vercel นะครับ");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
