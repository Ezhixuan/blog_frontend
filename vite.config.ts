import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VueDevTools()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
