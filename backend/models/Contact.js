const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["general", "order", "technical", "billing", "feedback"],
    },
    message: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      required: true,
      enum: ["low", "normal", "high", "urgent"],
      default: "normal",
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "in-progress", "resolved"],
      default: "pending",
    },
    metadata: {
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
