import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Set the backend URL based on the mode (development or production)
  const backendUrl =
    mode === "development"
      ? "http://localhost:5000" // Replace with your local backend URL in development
      : "https://studentengagementtrackingusersapis1-w1mev157.b4a.run"; // Production backend URL

  return {
    plugins: [react()],

    // Backend route proxy for development
    server: {
      proxy: {
        "/api": {
          target: backendUrl, // Use the backend URL based on the mode
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""), // Removes '/api' from the path
        },
      },
    },

    // No need to use define for backend URL as it's set in the `server.proxy`
  };
});
