import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'; // Import path module

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: { // Add server configuration
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    },
    fs: {
      allow: [
        // your project root
        '.',
        // Path to slick-carousel in node_modules
        path.resolve(__dirname, '../node_modules/slick-carousel'), // Adjusted path
        // Add other directories here if Vite blocks them
      ],
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          antd: ['antd']
        }
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: (content, filename) => {
          if (filename && !filename.endsWith('.scss')) {
            return `@use '@/styles/main.scss' as *;\n${content}`;
          }
          return content;
        }
      }
    }
  }
}) 