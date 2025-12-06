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
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading };
};

export default useSettings;

