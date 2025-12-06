const Settings = require("../models/Settings");

const getSettings = async (req, res, next) => {
  try {
    if (!process.env.MONGODB_URI) {
      // Return default settings if MongoDB not configured
      return res.json({
        github: "https://github.com/yourusername",
        linkedin: "https://www.linkedin.com/in/yourusername",
        email: "",
        name: "Your Name"
      });
    }

    const settings = await Settings.getSettings();
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    if (!process.env.MONGODB_URI) {
      return res.status(400).json({ error: "MongoDB not configured" });
    }

    const { github, linkedin, email, name } = req.body;

    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings({ github, linkedin, email, name });
    } else {
      if (github !== undefined) settings.github = github;
      if (linkedin !== undefined) settings.linkedin = linkedin;
      if (email !== undefined) settings.email = email;
      if (name !== undefined) settings.name = name;
    }

    await settings.save();
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

module.exports = { getSettings, updateSettings };

