import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/Buzz_Klur/",
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["three-stdlib"],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Adjust the chunk size warning limit if needed
  },
});
