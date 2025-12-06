const { Schema, model } = require("mongoose");

const projectViewSchema = new Schema(
  {
    projectId: {
      type: String,
      required: true,
      index: true
    },
    visitorId: {
      type: String,
      required: true,
      index: true
    },
    device: {
      type: String,
      enum: ["mobile", "desktop", "tablet"],
      default: "desktop"
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Compound index to prevent duplicate views (same visitor + same project + same day)
projectViewSchema.index({ projectId: 1, visitorId: 1, timestamp: 1 });

module.exports = model("ProjectView", projectViewSchema);

