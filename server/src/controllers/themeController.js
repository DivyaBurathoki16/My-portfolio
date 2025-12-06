const ThemeSettings = require("../models/ThemeSettings");

const getTheme = async (req, res, next) => {
  try {
    if (!process.env.MONGODB_URI) {
      // Return default theme if MongoDB not configured
      return res.json({
        primaryColor: "#0ea5e9",
        secondaryColor: "#8b5cf6",
        backgroundColor: "#ffffff",
        textColor: "#111111",
        accentColor: "#6366f1",
        cardBackground: "#f9fafb",
        primaryFont: "Inter",
        headingFont: "Inter",
        bodyFont: "Inter",
        fontScale: 1,
        borderRadius: "12px",
        cardStyle: "glass",
        navStyle: "transparent",
        heroHeadlineColor: "#0f172a",
        heroSubtitleColor: "#475569",
        heroBackgroundType: "gradient",
        heroGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        heroImageURL: "",
        currentMode: "light"
      });
    }

    const theme = await ThemeSettings.getThemeSettings();
    res.json(theme);
  } catch (error) {
    next(error);
  }
};

const updateTheme = async (req, res, next) => {
  try {
    if (!process.env.MONGODB_URI) {
      return res.status(400).json({ error: "MongoDB not configured" });
    }

    let theme = await ThemeSettings.findOne();
    
    if (!theme) {
      theme = new ThemeSettings(req.body);
    } else {
      // Update only provided fields
      Object.keys(req.body).forEach((key) => {
        if (req.body[key] !== undefined) {
          theme[key] = req.body[key];
        }
      });
    }

    await theme.save();
    res.json(theme);
  } catch (error) {
    next(error);
  }
};

module.exports = { getTheme, updateTheme };

