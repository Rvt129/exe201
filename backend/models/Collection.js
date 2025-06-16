const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    description: String,
    designs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Design" }],
    metadata: {
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
      isPublic: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

const Collection = mongoose.model("Collection", collectionSchema);
module.exports = Collection;
