const Contact = require("../models/Contact");
const asyncHandler = require("express-async-handler");

// @desc    Create new contact request
// @route   POST /api/support/contact
// @access  Public
const createContact = asyncHandler(async (req, res) => {
  const { name, email, subject, category, message, priority } = req.body;


  // Create contact request
  const contact = await Contact.create({
    name,
    email,
    subject,
    category,
    message,
    priority: priority || "normal",
  });

  if (contact) {
    res.status(201).json(contact);
  } else {
    res.status(400);
    throw new Error("Invalid contact data");
  }
});

// @desc    Get all contact requests
// @route   GET /api/support/contact
// @access  Private/Admin
const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({}).sort({ createdAt: -1 });
  res.json(contacts);
});

// @desc    Get contact request by ID
// @route   GET /api/support/contact/:id
// @access  Private/Admin
const getContactById = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (contact) {
    res.json(contact);
  } else {
    res.status(404);
    throw new Error("Contact request not found");
  }
});

// @desc    Update contact request status
// @route   PUT /api/support/contact/:id
// @access  Private/Admin
const updateContactStatus = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (contact) {
    contact.status = req.body.status || contact.status;
    contact.metadata.updatedAt = Date.now();

    const updatedContact = await contact.save();
    res.json(updatedContact);
  } else {
    res.status(404);
    throw new Error("Contact request not found");
  }
});

module.exports = {
  createContact,
  getContacts,
  getContactById,
  updateContactStatus,
};
