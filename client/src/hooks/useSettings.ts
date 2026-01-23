import { useState, useEffect } from "react";
import api from "../services/api";

interface Settings {
  github: string;
  linkedin: string;
  email: string;
  name: string;
}

const useSettings = () => {
  const [settings, setSettings] = useState<Settings>({
    github: "https://github.com/yourusername",
    linkedin: "https://www.linkedin.com/in/yourusername",
    email: "",
    name: "Your Name"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get("/settings");
        setSettings(response.data);
      } catch (error: any) {
        // Only log detailed errors in development mode
        if (import.meta.env.DEV) {
          const isNetworkError = error.code === "ERR_NETWORK" || error.message?.includes("Network Error");
          if (isNetworkError) {
            console.warn("API server not reachable. Using default settings. Please check your VITE_API_URL configuration.");
          } else {
            console.error("Failed to fetch settings:", error);
          }
        }
        // Settings already have default values, so no action needed
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading };
};

export default useSettings;

