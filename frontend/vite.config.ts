import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/spotify": "http://localhost:3000/",
      "/api": "http://localhost:3000/",
    },
  },
  plugins: [vue(), tailwindcss()],
});
