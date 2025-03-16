import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080", // Aponta para o Tomcat
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/org-rest-api/v1") // Corrige el camino
      }
    },
    allowedHosts: ['31fd-84-232-35-200.ngrok-free.app'],
    
  },
  plugins: [vue()],
})
