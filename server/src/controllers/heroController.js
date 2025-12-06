const HeroSettings = require("../models/HeroSettings");

const getHero = async (req, res, next) => {
  try {
    if (!process.env.MONGODB_URI) {
      // Return default hero settings if MongoDB not configured
      return res.json({
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
    }

    const heroSettings = await HeroSettings.getHeroSettings();
    res.json(heroSettings);
  } catch (error) {
    next(error);
  }
};

const updateHero = async (req, res, next) => {
  try {
    if (!process.env.MONGODB_URI) {
      return res.status(400).json({ error: "MongoDB not configured" });
    }

    let heroSettings = await HeroSettings.findOne();
    
    if (!heroSettings) {
      heroSettings = new HeroSettings(req.body);
    } else {
      // Update all provided fields
      Object.keys(req.body).forEach(key => {
        if (req.body[key] !== undefined) {
          heroSettings[key] = req.body[key];
        }
      });
    }

    await heroSettings.save();
    res.json(heroSettings);
  } catch (error) {
    next(error);
  }
};

module.exports = { getHero, updateHero };

