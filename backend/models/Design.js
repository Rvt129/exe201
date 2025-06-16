const mongoose = require("mongoose");

const designSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    colorId: { type: mongoose.Schema.Types.ObjectId },
    designData: {
      type: mongoose.Schema.Types.Mixed, // JSON data của canvas
      required: true,
    },
    previewImage: String, // base64 hoặc url - ảnh mockup
    printDesignImage: String, // base64 hoặc url - ảnh design sạch để in
    selectedSize: { type: String, enum: ["XS", "S", "M", "L", "XL", "XXL"] },
    selectedColor: {
      name: String,
      hexCode: String,
    },
    calculatedPrice: {
      type: Number,
      required: true,
      min: [0, "Calculated price must be positive"],
      validate: {
        validator: function (v) {
          return !isNaN(v) && isFinite(v) && v > 0;
        },
        message: "Calculated price must be a valid positive number",
      },
    }, // Tổng giá = giá size + phí thiết kế
    description: String,
    isPublic: { type: Boolean, default: false },
    isReported: { type: Boolean, default: false },
    reportReason: String,
    status: {
      type: String,
      enum: ["active", "hidden", "deleted", "archived"],
      default: "active",
    },
    tags: [String],
    metadata: {
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
    },
  },
  {
    timestamps: true,
  }
);

const Design = mongoose.model("Design", designSchema);
module.exports = Design;
