import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Vuetify from 'vite-plugin-vuetify'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    Vuetify(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),  
    },
  },
});
