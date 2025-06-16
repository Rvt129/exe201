const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    description: String,
    type: {
      type: String,
      required: true,
      enum: ["pet_tshirt"],
      default: "pet_tshirt",
    },
    sizes: [
      {
        name: {
          type: String,
          enum: [ "S", "M", "L", "XL", "Big Size"],
          required: true,
        },
        baseCost: {
          cat: { type: Number, required: true },
          dog: { type: Number, required: true },
        },
        weightRange: {
          cat: { type: String, required: true },
          dog: { type: String, required: true },
        },
        isAvailable: { type: Boolean, default: true },
      },
    ],
    colors: [
      {
        name: { type: String, required: true },
        hexCode: { type: String, required: true },
        mockupImageUrl: { type: String, required: true },
        isAvailable: { type: Boolean, default: true },
      },
    ],
    available: { type: Boolean, default: true },
    isCustomizable: { type: Boolean, default: true },
    designFee: { type: Number, default: 80000 }, // Phí thiết kế cố định
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

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
