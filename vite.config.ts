import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["@geeklab.app/audiencelab-react-web-sdk"],
  },
  resolve: {
    mainFields: ["module", "main", "exports"], // Ensure Vite uses the right entry point
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"], // Explicitly define extensions
  },
});
