const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    sessionToken: { type: String, required: true, unique: true },
    role: { type: String, enum: ["customer", "admin"] },
    ipAddress: String,
    userAgent: String,
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

const Session = mongoose.model("Session", sessionSchema);
module.exports = Session;
