const { Schema, model } = require("mongoose");

const themeSettingsSchema = new Schema(
  {
    // Color System
    primaryColor: {
      type: String,
      default: "#0ea5e9",
      trim: true
    },
    secondaryColor: {
      type: String,
      default: "#8b5cf6",
      trim: true
    },
    backgroundColor: {
      type: String,
      default: "#ffffff",
      trim: true
    },
    textColor: {
      type: String,
      default: "#111111",
      trim: true
    },
    accentColor: {
      type: String,
      default: "#6366f1",
      trim: true
    },
    cardBackground: {
      type: String,
      default: "#f9fafb",
      trim: true
    },

    // Typography
    primaryFont: {
      type: String,
      default: "Inter",
      trim: true
    },
    headingFont: {
      type: String,
      default: "Inter",
      trim: true
    },
    bodyFont: {
      type: String,
      default: "Inter",
      trim: true
    },
    fontScale: {
      type: Number,
      default: 1,
      min: 0.8,
      max: 1.5
    },

    // Layout
    borderRadius: {
      type: String,
      default: "12px",
      trim: true
    },
    cardStyle: {
      type: String,
      enum: ["glass", "elevated", "minimal"],
      default: "glass"
    },
    navStyle: {
      type: String,
      enum: ["transparent", "solid"],
      default: "transparent"
    },

    // Hero Section Style
    heroHeadlineColor: {
      type: String,
      default: "#0f172a",
      trim: true
    },
    heroSubtitleColor: {
      type: String,
      default: "#475569",
      trim: true
    },
    heroBackgroundType: {
      type: String,
      enum: ["gradient", "image", "solid"],
      default: "gradient"
    },
    heroGradient: {
      type: String,
      default: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      trim: true
    },
    heroImageURL: {
      type: String,
      default: "",
      trim: true
    },

    // Dark Mode Support (optional for future)
    currentMode: {
      type: String,
      enum: ["light", "dark"],
      default: "light"
    }
  },
  {
    timestamps: true
  }
);

// Ensure only one theme settings document exists
themeSettingsSchema.statics.getThemeSettings = async function() {
  let theme = await this.findOne();
  if (!theme) {
    theme = await this.create({});
  }
  return theme;
};

module.exports = model("ThemeSettings", themeSettingsSchema);

