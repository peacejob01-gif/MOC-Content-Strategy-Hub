import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';

// แก้ไขเรื่อง __dirname สำหรับ ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    // แนะนำให้ใช้ import.meta.env ในโค้ด แต่ถ้าโค้ดเดิมใช้ process.env ให้คงส่วนนี้ไว้
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'), // แนะนำให้ชี้ไปที่โฟลเดอร์ src
      },
    },
    build: {
      chunkSizeWarningLimit: 1600, // แก้ไขปัญหาแจ้งเตือน Chunk size
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              // แยก Library ใหญ่ๆ ออกเป็นก้อนเล็กๆ เพื่อให้โหลดหน้าเว็บเร็วขึ้น
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
          }
        }
      }
    }
  };
});
