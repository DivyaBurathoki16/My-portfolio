/**
 * API Configuration
 *
 * VITE_API_URL = base URL only (no /api).
 * Example: https://my-portfolio-teal-three-16.vercel.app
 * Routes like /api/projects belong in code, not in the env variable.
 */

const getApiUrl = (): string => {
  let apiUrl = import.meta.env.VITE_API_URL;

  if (!apiUrl) {
    if (import.meta.env.MODE === "production") {
      console.warn("VITE_API_URL is not set. API calls may fail.");
      return "";
    }
    throw new Error(
      "VITE_API_URL environment variable is not set. " +
        "Set it to your backend base URL (e.g. https://your-server.vercel.app) without /api."
    );
  }

  if (!apiUrl.startsWith("http://") && !apiUrl.startsWith("https://")) {
    apiUrl = `https://${apiUrl}`;
  }

  // Base URL only: strip trailing slash, never add /api
  return apiUrl.replace(/\/+$/, "");
};

export const API_URL = getApiUrl();
