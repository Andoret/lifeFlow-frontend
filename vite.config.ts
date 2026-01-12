import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  optimizeDeps: {
    // Excluir módulos de Tauri del pre-bundling (no están disponibles en desarrollo web)
    exclude: ['@tauri-apps/api/fs', '@tauri-apps/api/path'],
  },
})
