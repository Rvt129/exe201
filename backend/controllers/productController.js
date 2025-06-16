const Product = require("../models/Product");
const Category = require("../models/Category");
const asyncHandler = require("express-async-handler");

// Helper function to calculate price based on pet type and size
const calculateProductPrice = (product, petType, sizeName) => {
  const size = product.sizes.find((s) => s.name === sizeName);
  if (!size || !size.isAvailable) {
    return null;
  }

  const baseCost = size.baseCost[petType.toLowerCase()];
  if (!baseCost) {
    return null;
  }

  return {
    baseCost,
    designFee: product.isCustomizable ? product.designFee : 0,
    totalPrice: baseCost + (product.isCustomizable ? product.designFee : 0),
    weightRange: size.weightRange[petType.toLowerCase()],
  };
};

// Helper function to get available sizes for a pet type
const getAvailableSizesForPet = (product, petType) => {
  return product.sizes
    .filter((size) => size.isAvailable && size.baseCost[petType.toLowerCase()])
    .map((size) => ({
      name: size.name,
      baseCost: size.baseCost[petType.toLowerCase()],
      weightRange: size.weightRange[petType.toLowerCase()],
      isAvailable: size.isAvailable,
    }));
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const { category, type, isCustomizable, available } = req.query;
  let filter = {};
  if (category) filter.category = category;
  if (type) filter.type = type;
  if (isCustomizable !== undefined)
    filter.isCustomizable = isCustomizable === "true";
  if (available !== undefined) filter.available = available === "true";
  const products = await Product.find(filter)
    .populate("category", "name description")
    .sort({ createdAt: -1 });
  res.json(products);
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    "category",
    "name description"
  );

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Create a product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    category,
    description,
    type,
    sizes,
    colors,
    isCustomizable,
    available,
    designFee,
    metadata,
  } = req.body;

  const product = new Product({
    name,
    category,
    description,
    type,
    sizes, // Now contains baseCost (cat/dog prices) and weightRange for each size
    colors,
    isCustomizable,
    available,
    designFee: designFee || 80000, // Default design fee
    metadata,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Get customizable products for design
// @route   GET /api/products/customizable
// @access  Public
const getCustomizableProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isCustomizable: true, available: true })
    .populate("category", "name description")
    .sort({ createdAt: -1 });

  res.json(products);
});

// @desc    Get product pricing for specific pet type
// @route   GET /api/products/:id/pricing/:petType
// @access  Public
const getProductPricing = asyncHandler(async (req, res) => {
  const { id, petType } = req.params;

  if (!["cat", "dog"].includes(petType.toLowerCase())) {
    res.status(400);
    throw new Error("Pet type must be 'cat' or 'dog'");
  }

  const product = await Product.findById(id).populate(
    "category",
    "name description"
  );

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const availableSizes = getAvailableSizesForPet(product, petType);

  if (availableSizes.length === 0) {
    res.status(404);
    throw new Error(`No available sizes for ${petType}`);
  }

  res.json({
    product: {
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      type: product.type,
      isCustomizable: product.isCustomizable,
      designFee: product.designFee,
      colors: product.colors.filter((color) => color.isAvailable),
    },
    petType: petType.toLowerCase(),
    availableSizes,
    designFee: product.isCustomizable ? product.designFee : 0,
  });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  getCustomizableProducts,
  getProductPricing,
};
