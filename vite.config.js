import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080/org-rest-api/v1",
        changeOrigin: true
      },
      "/public": {
        target: "http://localhost:8080/org-rest-api/v1",
        changeOrigin: true
      }
    }
  }, plugins: [vue()],
})
