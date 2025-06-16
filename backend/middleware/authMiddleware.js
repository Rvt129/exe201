const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// Protect routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        res.status(401);
        throw new Error("Not authorized, user not found");
      }

      // Check if account is locked
      if (req.user.security && req.user.security.isLocked) {
        const now = new Date();
        if (req.user.security.lockUntil && req.user.security.lockUntil > now) {
          res.status(401);
          throw new Error(
            "Account is temporarily locked. Please try again later."
          );
        } else {
          // Unlock account if lock time has passed
          req.user.security.isLocked = false;
          req.user.security.loginAttempts = 0;
          await req.user.save();
        }
      }

      // Check if user is active
      if (req.user.metadata && !req.user.metadata.isActive) {
        res.status(401);
        throw new Error("User account has been deactivated");
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

// Admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an admin");
  }
};

module.exports = { protect, admin };
