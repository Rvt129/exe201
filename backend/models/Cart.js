const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    sessionId: { type: String },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        design: { type: mongoose.Schema.Types.ObjectId, ref: "Design" },
        quantity: { type: Number, required: true, default: 1 },
        petType: {
          type: String,
          enum: ["cat", "dog"],
          required: true,
          default: "dog",
        },
        baseCost: { type: Number, required: true }, // Cost for selected pet type and size
        designFee: { type: Number, default: 0 }, // Design fee if applicable
        unitPrice: { type: Number, required: true }, // baseCost + designFee
        totalPrice: { type: Number, required: true }, // unitPrice * quantity
        size: {
          type: String,
          enum: ["S", "M", "L", "XL", "Big Size"],
          required: true,
        },
        weightRange: { type: String }, // Weight range for selected pet type and size
        color: {
          name: String,
          hexCode: String,
        },
        customization: { type: mongoose.Schema.Types.Mixed },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    total: { type: Number, required: true, default: 0 },
    metadata: {
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
      expiresAt: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

// Helper method to calculate item pricing
cartSchema.methods.calculateItemPricing = function (itemData, product) {
  const { petType, size, quantity } = itemData;

  // Find the size info for the specific pet type
  const sizeInfo = product.sizes.find((s) => s.name === size);
  if (!sizeInfo) {
    throw new Error(`Size ${size} not found for product`);
  }

  // Get base cost for the pet type
  const baseCost = sizeInfo.baseCost[petType.toLowerCase()];
  if (!baseCost) {
    throw new Error(`Price not available for ${petType} in size ${size}`);
  }

  // Get weight range for the pet type
  const weightRange = sizeInfo.weightRange[petType.toLowerCase()];

  // Calculate design fee
  const designFee =
    itemData.design && product.isCustomizable ? product.designFee : 0;

  // Calculate prices
  const unitPrice = baseCost + designFee;
  const totalPrice = unitPrice * quantity;

  return {
    baseCost,
    designFee,
    unitPrice,
    totalPrice,
    weightRange,
  };
};

// Helper method to recalculate cart total
cartSchema.methods.calculateTotal = function () {
  this.total = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
  return this.total;
};

// Pre-save middleware to update timestamps and total
cartSchema.pre("save", function (next) {
  this.metadata.updatedAt = new Date();
  this.calculateTotal();
  next();
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
