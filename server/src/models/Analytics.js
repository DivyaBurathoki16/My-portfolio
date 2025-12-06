const { Schema, model } = require("mongoose");

const analyticsSchema = new Schema(
  {
    route: {
      type: String,
      required: true,
      trim: true
    },
    device: {
      type: String,
      enum: ["mobile", "desktop", "tablet"],
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    },
    ipAddress: {
      type: String,
      trim: true,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

// Index for efficient queries
analyticsSchema.index({ timestamp: -1 });
analyticsSchema.index({ route: 1, timestamp: -1 });
analyticsSchema.index({ device: 1, timestamp: -1 });

module.exports = model("Analytics", analyticsSchema);

