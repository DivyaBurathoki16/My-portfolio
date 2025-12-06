const { Schema, model } = require("mongoose");

const settingsSchema = new Schema(
  {
    github: {
      type: String,
      default: "https://github.com/yourusername",
      trim: true
    },
    linkedin: {
      type: String,
      default: "https://www.linkedin.com/in/yourusername",
      trim: true
    },
    email: {
      type: String,
      default: "",
      trim: true
    },
    name: {
      type: String,
      default: "Your Name",
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = model("Settings", settingsSchema);

