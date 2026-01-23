import { useState, useEffect } from "react";
import api from "../services/api";

export interface HeroSkill {
  icon: string;
  label: string;
}

export interface HeroFeature {
  icon: string;
  text: string;
}

export interface HeroStat {
  number: string;
  label: string;
}

export interface HeroQuickLink {
  icon: string;
  label: string;
  href: string;
}

export interface HeroSettings {
  eyebrow: string;
  heading: string;
  subhead: string;
  bio: string;
  skills: HeroSkill[];
  badgeText: string;
  achievementTitle: string;
  achievementHighlight: string;
  achievementDescription: string;
  features: HeroFeature[];
  techStack: string[];
  stats: HeroStat[];
  quickLinks: HeroQuickLink[];
  primaryButtonText: string;
  secondaryButtonText: string;
}

const useHero = () => {
  const [heroSettings, setHeroSettings] = useState<HeroSettings>({
    eyebrow: "Full-Stack MERN Developer",
    heading: "I design operations-ready web apps that keep cross-functional teams in sync and shipping faster.",
    subhead: "End-to-end product thinker with an obsession for smooth handoffs, realtime insight, and reliable data pipes.",
    bio: "I'm a passionate full-stack developer specializing in the MERN stack, Android development, and AI integration. I solve complex problems by building scalable, maintainable applications that deliver real business value. Currently focused on creating seamless user experiences and exploring the intersection of AI and web technologies.",
    skills: [
      { icon: "FiCode", label: "MERN Stack" },
      { icon: "FiSmartphone", label: "Android Dev" },
      { icon: "FiCpu", label: "AI Integration" },
      { icon: "FiTrendingUp", label: "Full-Stack" }
    ],
    badgeText: "Available for freelance • 2025",
    achievementTitle: "Latest Achievement",
    achievementHighlight: "37% Improvement",
    achievementDescription: "Rebuilt a tour-operations platform on the MERN stack with live dashboards, trimmed SLA breaches by 37%.",
    features: [
      { icon: "FiZap", text: "Realtime messaging" },
      { icon: "FiTrendingUp", text: "Automated finance workflows" },
      { icon: "FiShield", text: "Secure access control" }
    ],
    techStack: ["React", "Node.js", "MongoDB", "Express", "TypeScript", "Android", "Python", "AI/ML"],
    stats: [
      { number: "37%", label: "SLA Reduction" },
      { number: "24/7", label: "Uptime" },
      { number: "100%", label: "Client Satisfaction" }
    ],
    quickLinks: [
      { icon: "FiGithub", label: "GitHub", href: "#" },
      { icon: "FiLinkedin", label: "LinkedIn", href: "#" },
      { icon: "FiMail", label: "Email", href: "#contact" },
      { icon: "FiGlobe", label: "Portfolio", href: "#projects" }
    ],
    primaryButtonText: "View Projects",
    secondaryButtonText: "Contact Me"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const response = await api.get<HeroSettings>("/hero");
        setHeroSettings(response.data);
      } catch (error: any) {
        // Only log detailed errors in development mode
        if (import.meta.env.DEV) {
          const isNetworkError = error.code === "ERR_NETWORK" || error.message?.includes("Network Error");
          if (isNetworkError) {
            console.warn("API server not reachable. Using default hero settings. Please check your VITE_API_URL configuration.");
          } else {
            console.error("Failed to fetch hero settings:", error);
          }
        }
        // Hero settings already have default values, so no action needed
      } finally {
        setLoading(false);
      }
    };

    fetchHero();
  }, []);

  return { heroSettings, loading };
};

export default useHero;

