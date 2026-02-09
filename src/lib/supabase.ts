import { createClient } from '@supabase/supabase-js';

// ใส่ค่า URL และ Anon Key ของคุณลงไปตรงๆ เลยครับ (ก๊อปมาจากหน้า API ใน Supabase)
const supabaseUrl = 'https://your-project.supabase.co'; 
const supabaseAnonKey = 'your-very-long-anon-key-here';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
