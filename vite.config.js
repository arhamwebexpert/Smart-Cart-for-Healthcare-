import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // ← bind to all network interfaces
    port: 5000, // ← same port you had
    strictPort: true, // ← fail rather than try next port if 5000 is busy
  },
});
