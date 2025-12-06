import { useEffect, useState } from "react";
import api from "../services/api.ts";

export type Project = {
  id: string;
  title: string;
  description: string;
  tech: string[];
  github: string;
  live: string;
  image: string;
};

const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchProjects = async () => {
      try {
        const { data } = await api.get<Project[]>("/projects");
        if (mounted) {
          setProjects(data);
        }
      } catch (err) {
        setError("Unable to load projects. Please refresh.");
        console.error(err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    fetchProjects();
    return () => {
      mounted = false;
    };
  }, []);

  return { projects, loading, error };
};

export default useProjects;

