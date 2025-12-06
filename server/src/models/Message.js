const { Schema, model } = require("mongoose");

const messageSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    company: {
      type: String,
      trim: true,
      maxlength: 120
    },
    message: {
      type: String,
      required: true,
      maxlength: 1200
    }
  },
  {
    timestamps: true
  }
);

module.exports = model("Message", messageSchema);

