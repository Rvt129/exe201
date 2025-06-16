const Collection = require("../models/Collection");

// Lấy tất cả collections
exports.getAllCollections = async (req, res) => {
  try {
    const collections = await Collection.find().populate("user").populate("designs");
    res.json(collections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy một collection theo ID
exports.getCollectionById = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id)
      .populate("user")
      .populate("designs");
    if (!collection) return res.status(404).json({ error: "Collection not found" });
    res.json(collection);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tạo mới collection
exports.createCollection = async (req, res) => {
  try {
    const collection = new Collection(req.body);
    await collection.save();
    res.status(201).json(collection);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Cập nhật collection
exports.updateCollection = async (req, res) => {
  try {
    const collection = await Collection.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!collection) return res.status(404).json({ error: "Collection not found" });
    res.json(collection);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Xóa collection
exports.deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findByIdAndDelete(req.params.id);
    if (!collection) return res.status(404).json({ error: "Collection not found" });
    res.json({ message: "Collection deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};