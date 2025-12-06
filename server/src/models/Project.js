const { Schema, model } = require("mongoose");

const projectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    description: {
      type: String,
      required: true,
      maxlength: 500
    },
    tech: {
      type: [String],
      required: true,
      default: []
    },
    github: {
      type: String,
      trim: true,
      default: ""
    },
    live: {
      type: String,
      trim: true,
      default: ""
    },
    image: {
      type: String,
      trim: true,
      default: ""
    },
    featured: {
      type: Boolean,
      default: false
    },
    order: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = model("Project", projectSchema);

