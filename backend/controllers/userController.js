const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, phone } = req.body;

  if (!email || !password || !firstName || !lastName) {
    res.status(400);
    throw new Error("Please fill all required fields");
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Create user
  const user = await User.create({
    email,
    password,
    profile: {
      firstName,
      lastName,
      phone: phone || "",
    },
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      email: user.email,
      role: user.role,
      profile: user.profile,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // Update last login time
    user.security.lastLogin = Date.now();
    user.security.loginAttempts = 0;
    await user.save();

    res.json({
      _id: user._id,
      email: user.email,
      role: user.role,
      profile: user.profile,
      token: generateToken(user._id),
    });
  } else {
    // Increment login attempts if user exists
    if (user) {
      user.security.loginAttempts += 1;

      // Lock account after 5 failed attempts
      if (user.security.loginAttempts >= 5) {
        user.security.isLocked = true;
        user.security.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
      }

      await user.save();
    }

    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // Update email if provided and not already used
    if (req.body.email && req.body.email !== user.email) {
      const emailExists = await User.findOne({ email: req.body.email });
      if (emailExists) {
        res.status(400);
        throw new Error("Email already in use");
      }
      user.email = req.body.email || user.email;
    }

    // Update password if provided
    if (req.body.password) {
      user.password = req.body.password;
    }

    // Update profile data if provided
    if (req.body.firstName) user.profile.firstName = req.body.firstName;
    if (req.body.lastName) user.profile.lastName = req.body.lastName;
    if (req.body.phone) user.profile.phone = req.body.phone;

    // Update metadata
    user.metadata.updatedAt = Date.now();

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      email: updatedUser.email,
      role: updatedUser.role,
      profile: updatedUser.profile,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get all user addresses
// @route   GET /api/users/addresses
// @access  Private
const getUserAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("profile.addresses");

  if (user) {
    res.json(user.profile.addresses);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Add new address
// @route   POST /api/users/addresses
// @access  Private
const addUserAddress = asyncHandler(async (req, res) => {
  const { name, phone, street, ward, district, city, isDefault } = req.body;

  if (!name || !phone || !street || !ward || !district || !city) {
    res.status(400);
    throw new Error("Please fill all required address fields");
  }

  const user = await User.findById(req.user._id);

  if (user) {
    const newAddress = {
      name,
      phone,
      street,
      ward,
      district,
      city,
      isDefault: isDefault || false,
    };

    // If this is the first address or isDefault is true, make it the default
    if (isDefault || user.profile.addresses.length === 0) {
      // First, set all existing addresses to non-default
      user.profile.addresses.forEach((address) => {
        address.isDefault = false;
      });

      newAddress.isDefault = true;
    }

    user.profile.addresses.push(newAddress);
    user.metadata.updatedAt = Date.now();

    await user.save();

    res.status(201).json(user.profile.addresses);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user address
// @route   PUT /api/users/addresses/:id
// @access  Private
const updateUserAddress = asyncHandler(async (req, res) => {
  const addressId = req.params.id;
  const { name, phone, street, ward, district, city, isDefault } = req.body;

  const user = await User.findById(req.user._id);

  if (user) {
    const addressIndex = user.profile.addresses.findIndex(
      (address) => address._id.toString() === addressId
    );

    if (addressIndex === -1) {
      res.status(404);
      throw new Error("Address not found");
    }

    // Update address fields if provided
    if (name) user.profile.addresses[addressIndex].name = name;
    if (phone) user.profile.addresses[addressIndex].phone = phone;
    if (street) user.profile.addresses[addressIndex].street = street;
    if (ward) user.profile.addresses[addressIndex].ward = ward;
    if (district) user.profile.addresses[addressIndex].district = district;
    if (city) user.profile.addresses[addressIndex].city = city;

    // Handle default address
    if (isDefault) {
      // Set all addresses to non-default
      user.profile.addresses.forEach((address) => {
        address.isDefault = false;
      });

      // Set this address as default
      user.profile.addresses[addressIndex].isDefault = true;
    }

    user.metadata.updatedAt = Date.now();
    await user.save();

    res.json(user.profile.addresses);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Delete user address
// @route   DELETE /api/users/addresses/:id
// @access  Private
const deleteUserAddress = asyncHandler(async (req, res) => {
  const addressId = req.params.id;
  const user = await User.findById(req.user._id);

  if (user) {
    const addressIndex = user.profile.addresses.findIndex(
      (address) => address._id.toString() === addressId
    );

    if (addressIndex === -1) {
      res.status(404);
      throw new Error("Address not found");
    }

    // Check if we're deleting the default address
    const wasDefault = user.profile.addresses[addressIndex].isDefault;

    // Remove the address
    user.profile.addresses.splice(addressIndex, 1);

    // If we deleted the default address and there are other addresses, make the first one default
    if (wasDefault && user.profile.addresses.length > 0) {
      user.profile.addresses[0].isDefault = true;
    }

    user.metadata.updatedAt = Date.now();
    await user.save();

    res.json(user.profile.addresses);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Set address as default
// @route   PUT /api/users/addresses/:id/default
// @access  Private
const setDefaultAddress = asyncHandler(async (req, res) => {
  const addressId = req.params.id;
  const user = await User.findById(req.user._id);

  if (user) {
    const addressExists = user.profile.addresses.some(
      (address) => address._id.toString() === addressId
    );

    if (!addressExists) {
      res.status(404);
      throw new Error("Address not found");
    }

    // Set all addresses to non-default
    user.profile.addresses.forEach((address) => {
      address.isDefault = address._id.toString() === addressId;
    });

    user.metadata.updatedAt = Date.now();
    await user.save();

    res.json(user.profile.addresses);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Change password
// @route   PUT /api/users/password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error("Please provide current and new password");
  }

  const user = await User.findById(req.user._id);

  if (user && (await user.matchPassword(currentPassword))) {
    user.password = newPassword;
    user.metadata.updatedAt = Date.now();

    await user.save();

    res.json({ message: "Password updated successfully" });
  } else {
    res.status(401);
    throw new Error("Current password is incorrect");
  }
});

// @desc    Enable/Disable 2FA
// @route   PUT /api/users/2fa
// @access  Private
const toggle2FA = asyncHandler(async (req, res) => {
  const { enable } = req.body;

  if (enable === undefined) {
    res.status(400);
    throw new Error("Please specify whether to enable or disable 2FA");
  }

  const user = await User.findById(req.user._id);

  if (user) {
    user.security.is2FAEnabled = enable;

    // If enabling 2FA, generate a secret key (in a real app, use a proper 2FA library)
    if (enable && !user.security.secretKey) {
      // This is a placeholder - in a real app, use a library like speakeasy to generate a proper secret
      user.security.secretKey = Math.random().toString(36).substring(2, 15);
    }

    user.metadata.updatedAt = Date.now();
    await user.save();

    res.json({
      is2FAEnabled: user.security.is2FAEnabled,
      secretKey: user.security.is2FAEnabled ? user.security.secretKey : null,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password");
  res.json(users);
});

// @desc    Delete user (admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get user by ID (admin only)
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user (admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    user.profile.firstName = req.body.firstName || user.profile.firstName;
    user.profile.lastName = req.body.lastName || user.profile.lastName;
    user.profile.phone = req.body.phone || user.profile.phone;
    user.metadata.isActive =
      req.body.isActive !== undefined
        ? req.body.isActive
        : user.metadata.isActive;
    user.metadata.updatedAt = Date.now();

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      email: updatedUser.email,
      role: updatedUser.role,
      profile: updatedUser.profile,
      metadata: updatedUser.metadata,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUserAddresses,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  setDefaultAddress,
  changePassword,
  toggle2FA,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};
