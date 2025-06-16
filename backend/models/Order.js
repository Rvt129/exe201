const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderNumber: { type: String, unique: true },
    customer: {
      email: String,
      firstName: String,
      lastName: String,
      phone: String,
    },
    shippingAddress: {
      name: String,
      phone: String,
      street: String,
      ward: String,
      district: String,
      city: String,
    },
    items: [
      {
        design: { type: mongoose.Schema.Types.ObjectId, ref: "Design" },
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        productName: String,
        colorName: String,
        colorHex: String,
        size: String,
        petType: { type: String, enum: ["cat", "dog"], default: "dog" }, // Add petType field
        quantity: { type: Number, default: 1 },
        unitPrice: Number,
        totalPrice: Number,
        designSnapshot: {
          canvasData: String,
          previewImage: String,
        },
      },
    ],
    pricing: {
      subtotal: Number,
      shippingFee: Number,
      tax: Number,
      discount: Number,
      total: Number,
    },
    payment: {
      method: String,
      status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
      },
      transactionId: String,
      paidAt: Date,
      gateway: String,
    },
    fulfillment: {
      status: {
        type: String,
        enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
        default: "pending",
      },
      trackingNumber: String,
      shippedAt: Date,
      deliveredAt: Date,
      notes: String,
    },
    hasFeedback: { type: Boolean, default: false }, // Add this line
    metadata: {
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
      processedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
