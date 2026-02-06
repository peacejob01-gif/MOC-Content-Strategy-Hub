import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

// แก้ไขเรื่อง __dirname สำหรับ ESM ให้รองรับทั้ง Windows และ Linux (Vercel)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  // โหลด Environment Variables
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    // กำหนดค่าตัวแปรเพื่อให้โค้ดเรียกใช้ process.env ได้โดยไม่พัง
    define: {
      'process.env': env
    },
    resolve: {
      alias: {
        // แนะนำให้ใช้ @ แทนโฟลเดอร์ src เพื่อการเขียนโค้ดที่สะอาดขึ้น
        '@': path.resolve(__dirname, './src')
      },
    },
    build: {
      chunkSizeWarningLimit: 2000, // ขยายเพดานเตือนเป็น 2MB
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          // ปรับปรุงการแยกไฟล์ให้เสถียรขึ้น ป้องกันชื่อไฟล์ยาวเกินไป
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react')) return 'vendor-react';
              if (id.includes('lucide')) return 'vendor-icons';
              if (id.includes('recharts')) return 'vendor-charts';
              return 'vendor-others';
            }
          }
        }
      }
    }
  };
});
