import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import template from 'vite-plugin-template';
export default defineConfig({
  plugins: [vue(), template()]
})
