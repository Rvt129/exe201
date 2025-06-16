const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Design = require("../models/Design");
const asyncHandler = require("express-async-handler");

// Helper function to calculate item price based on petType, size and design
const calculateItemPrice = async (
  productId,
  designId,
  size,
  petType = "dog"
) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  // Find size info for the product
  const sizeObj = product.sizes.find((s) => s.name === size);
  if (!sizeObj) {
    throw new Error(`Size ${size} not available for this product`);
  }

  // Get base cost for the specific pet type
  const baseCost = sizeObj.baseCost[petType.toLowerCase()];
  if (!baseCost) {
    throw new Error(`Price not available for ${petType} in size ${size}`);
  }

  // Get weight range for the pet type
  const weightRange = sizeObj.weightRange[petType.toLowerCase()];

  // Calculate design fee if this is a custom design
  const designFee =
    designId && product.isCustomizable ? product.designFee || 0 : 0;

  // Calculate total unit price
  const unitPrice = baseCost + designFee;

  return {
    baseCost,
    designFee,
    unitPrice,
    weightRange,
  };
};

// Helper function to process cart items and add full image URLs
const processCartItems = (cart, baseUrl) => {
  if (!cart || !cart.items) return cart;

  return {
    ...cart.toObject(),
    items: cart.items.map((item) => {
      const processedItem = { ...item.toObject() };

      // Add full URL for product images
      if (processedItem.product) {
        if (processedItem.product.baseImageUrl) {
          processedItem.product.imageUrl =
            processedItem.product.baseImageUrl.startsWith("http")
              ? processedItem.product.baseImageUrl
              : `${baseUrl}${processedItem.product.baseImageUrl}`;
        }
        if (processedItem.product.mockupImageUrl) {
          processedItem.product.mockupImageUrl =
            processedItem.product.mockupImageUrl.startsWith("http")
              ? processedItem.product.mockupImageUrl
              : `${baseUrl}${processedItem.product.mockupImageUrl}`;
        }
      }

      // Add full URL for design images
      if (processedItem.design) {
        if (processedItem.design.previewImage) {
          processedItem.design.previewImageUrl =
            processedItem.design.previewImage.startsWith("http")
              ? processedItem.design.previewImage
              : `${baseUrl}${processedItem.design.previewImage}`;
        }
        if (processedItem.design.finalImage) {
          processedItem.design.finalImageUrl =
            processedItem.design.finalImage.startsWith("http")
              ? processedItem.design.finalImage
              : `${baseUrl}${processedItem.design.finalImage}`;
        }
      }

      return processedItem;
    }),
  };
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id })
    .populate("items.product")
    .populate("items.design");

  if (!cart) {
    return res.status(200).json({ items: [], total: 0 });
  }

  // Add full URL for images
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  // Process cart items to add full image URLs
  const processedCart = processCartItems(cart, baseUrl);

  res.status(200).json(processedCart);
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, designId, quantity, size, petType, color, customization } =
    req.body;

  // Validate required fields
  if (!productId) {
    res.status(400);
    throw new Error("Product ID is required");
  }

  if (!size) {
    res.status(400);
    throw new Error("Size is required for pricing calculation");
  }

  if (!petType || !["cat", "dog"].includes(petType.toLowerCase())) {
    res.status(400);
    throw new Error("Pet type is required and must be 'cat' or 'dog'");
  }

  // Calculate pricing based on petType, size and design
  const pricingInfo = await calculateItemPrice(
    productId,
    designId,
    size,
    petType
  );

  let cart = await Cart.findOne({ user: req.user._id });

  const safeQuantity =
    quantity && !isNaN(quantity) && quantity > 0 ? quantity : 1;
  const totalPrice = pricingInfo.unitPrice * safeQuantity;

  const newItem = {
    product: productId,
    design: designId || undefined,
    quantity: safeQuantity,
    petType: petType.toLowerCase(),
    baseCost: pricingInfo.baseCost,
    designFee: pricingInfo.designFee,
    unitPrice: pricingInfo.unitPrice,
    totalPrice,
    size,
    weightRange: pricingInfo.weightRange,
    color,
    customization,
  };

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [newItem],
      total: totalPrice,
    });
  } else {
    // Check if same item exists (same product, design, size, petType, color)
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        (item.design?.toString() === designId || (!item.design && !designId)) &&
        item.size === size &&
        item.petType === petType.toLowerCase() &&
        item.color?.hexCode === color?.hexCode
    );

    if (existingItemIndex > -1) {
      // Update existing item - recalculate price in case it changed
      const currentPricingInfo = await calculateItemPrice(
        productId,
        designId,
        size,
        petType
      );
      cart.items[existingItemIndex].quantity += safeQuantity;
      cart.items[existingItemIndex].baseCost = currentPricingInfo.baseCost;
      cart.items[existingItemIndex].designFee = currentPricingInfo.designFee;
      cart.items[existingItemIndex].unitPrice = currentPricingInfo.unitPrice;
      cart.items[existingItemIndex].totalPrice =
        currentPricingInfo.unitPrice * cart.items[existingItemIndex].quantity;
      cart.items[existingItemIndex].weightRange =
        currentPricingInfo.weightRange;
    } else {
      cart.items.push(newItem);
    }

    cart.total = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
    await cart.save();
  }

  const populatedCart = await Cart.findById(cart._id)
    .populate("items.product")
    .populate("items.design");

  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const processedCart = processCartItems(populatedCart, baseUrl);

  res.status(200).json(processedCart);
});

// @desc    Update cart item quantity, size, or pet type
// @route   PUT /api/cart/:itemId
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity, size, petType } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  const item = cart.items.id(req.params.itemId);
  if (!item) {
    res.status(404);
    throw new Error("Item not found in cart");
  }

  let needsPriceRecalculation = false;

  // Update quantity if provided
  if (quantity !== undefined) {
    if (isNaN(quantity) || quantity < 1) {
      res.status(400);
      throw new Error("Invalid quantity");
    }
    item.quantity = quantity;
  }

  // Update size if provided - recalculate price
  if (size !== undefined) {
    item.size = size;
    needsPriceRecalculation = true;
  }

  // Update pet type if provided - recalculate price
  if (petType !== undefined) {
    if (!["cat", "dog"].includes(petType.toLowerCase())) {
      res.status(400);
      throw new Error("Pet type must be 'cat' or 'dog'");
    }
    item.petType = petType.toLowerCase();
    needsPriceRecalculation = true;
  }

  // Recalculate pricing if size or pet type changed
  if (needsPriceRecalculation) {
    const pricingInfo = await calculateItemPrice(
      item.product.toString(),
      item.design?.toString(),
      item.size,
      item.petType
    );

    item.baseCost = pricingInfo.baseCost;
    item.designFee = pricingInfo.designFee;
    item.unitPrice = pricingInfo.unitPrice;
    item.weightRange = pricingInfo.weightRange;
  }

  // Ensure we have valid numbers
  if (isNaN(item.unitPrice) || item.unitPrice < 0) {
    res.status(400);
    throw new Error("Invalid unit price calculation");
  }

  if (isNaN(item.quantity) || item.quantity < 1) {
    item.quantity = 1;
  }

  // Recalculate total price for this item
  item.totalPrice = item.unitPrice * item.quantity;

  // Recalculate cart total
  cart.total = cart.items.reduce((sum, cartItem) => {
    const itemTotal = cartItem.totalPrice || 0;
    return sum + itemTotal;
  }, 0);

  await cart.save();

  const populatedCart = await Cart.findById(cart._id)
    .populate("items.product")
    .populate("items.design");

  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const processedCart = processCartItems(populatedCart, baseUrl);

  res.status(200).json(processedCart);
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  cart.items = cart.items.filter(
    (item) => item._id.toString() !== req.params.itemId
  );

  cart.total = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);

  await cart.save();
  const populatedCart = await Cart.findById(cart._id)
    .populate("items.product")
    .populate("items.design");

  // Add full URL for images
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const processedCart = processCartItems(populatedCart, baseUrl);

  res.status(200).json(processedCart);
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
};
