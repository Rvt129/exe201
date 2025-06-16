const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    profile: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      phone: { type: String },
      addresses: [
        {
          name: String,
          phone: String,
          street: String,
          ward: String,
          district: String,
          city: String,
          isDefault: { type: Boolean, default: false },
        },
      ],
    },
    security: {
      is2FAEnabled: { type: Boolean, default: false },
      secretKey: { type: String },
      lastLogin: { type: Date },
      loginAttempts: { type: Number, default: 0 },
      isLocked: { type: Boolean, default: false },
      lockUntil: { type: Date },
    },
    metadata: {
      isActive: { type: Boolean, default: true },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
