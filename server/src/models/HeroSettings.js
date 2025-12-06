const { Schema, model } = require("mongoose");

const heroSettingsSchema = new Schema(
  {
    // Top section
    eyebrow: {
      type: String,
      default: "Full-Stack MERN Developer",
      trim: true
    },
    heading: {
      type: String,
      default: "I design operations-ready web apps that keep cross-functional teams in sync and shipping faster.",
      trim: true
    },
    subhead: {
      type: String,
      default: "End-to-end product thinker with an obsession for smooth handoffs, realtime insight, and reliable data pipes.",
      trim: true
    },
    bio: {
      type: String,
      default: "I'm a passionate full-stack developer specializing in the MERN stack, Android development, and AI integration. I solve complex problems by building scalable, maintainable applications that deliver real business value. Currently focused on creating seamless user experiences and exploring the intersection of AI and web technologies.",
      trim: true
    },
    // Skills array
    skills: {
      type: [
        {
          icon: { type: String, default: "FiCode" },
          label: { type: String, required: true }
        }
      ],
      default: [
        { icon: "FiCode", label: "MERN Stack" },
        { icon: "FiSmartphone", label: "Android Dev" },
        { icon: "FiCpu", label: "AI Integration" },
        { icon: "FiTrendingUp", label: "Full-Stack" }
      ]
    },
    // Badge
    badgeText: {
      type: String,
      default: "Available for freelance • 2025",
      trim: true
    },
    // Achievement section
    achievementTitle: {
      type: String,
      default: "Latest Achievement",
      trim: true
    },
    achievementHighlight: {
      type: String,
      default: "37% Improvement",
      trim: true
    },
    achievementDescription: {
      type: String,
      default: "Rebuilt a tour-operations platform on the MERN stack with live dashboards, trimmed SLA breaches by 37%.",
      trim: true
    },
    // Features array
    features: {
      type: [
        {
          icon: { type: String, default: "FiZap" },
          text: { type: String, required: true }
        }
      ],
      default: [
        { icon: "FiZap", text: "Realtime messaging" },
        { icon: "FiTrendingUp", text: "Automated finance workflows" },
        { icon: "FiShield", text: "Secure access control" }
      ]
    },
    // Tech stack array
    techStack: {
      type: [String],
      default: ["React", "Node.js", "MongoDB", "Express", "TypeScript", "Android", "Python", "AI/ML"]
    },
    // Stats array
    stats: {
      type: [
        {
          number: { type: String, required: true },
          label: { type: String, required: true }
        }
      ],
      default: [
        { number: "37%", label: "SLA Reduction" },
        { number: "24/7", label: "Uptime" },
        { number: "100%", label: "Client Satisfaction" }
      ]
    },
    // Quick links array
    quickLinks: {
      type: [
        {
          icon: { type: String, default: "FiGithub" },
          label: { type: String, required: true },
          href: { type: String, default: "#" }
        }
      ],
      default: [
        { icon: "FiGithub", label: "GitHub", href: "#" },
        { icon: "FiLinkedin", label: "LinkedIn", href: "#" },
        { icon: "FiMail", label: "Email", href: "#contact" },
        { icon: "FiGlobe", label: "Portfolio", href: "#projects" }
      ]
    },
    // CTA buttons
    primaryButtonText: {
      type: String,
      default: "View Projects",
      trim: true
    },
    secondaryButtonText: {
      type: String,
      default: "Contact Me",
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Ensure only one hero settings document exists
heroSettingsSchema.statics.getHeroSettings = async function() {
  let heroSettings = await this.findOne();
  if (!heroSettings) {
    heroSettings = await this.create({});
  }
  return heroSettings;
};

module.exports = model("HeroSettings", heroSettingsSchema);

