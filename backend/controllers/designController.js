const Design = require("../models/Design");
const Product = require("../models/Product");
const asyncHandler = require("express-async-handler");
const fs = require("fs");
const path = require("path");

// Helper function to save base64 image to file
const saveBase64Image = (base64String, subfolder, baseFilenamePrefix) => {
  if (!base64String) return null;

  try {
    // Regex to extract mime type and base64 data
    const matches = base64String.match(
      /^data:(image\/([A-Za-z-+\/]+));base64,(.+)$/
    );
    if (!matches || matches.length !== 4) {
      // If no match, assume it might be raw base64 without prefix (less ideal)
      // For robustness, it's better if frontend always sends the full data URI
      // For now, let's try to proceed if it's just base64 data, defaulting to png
      const rawBase64Data = base64String.includes(",")
        ? base64String.split(",")[1]
        : base64String;
      const imageBuffer = Buffer.from(rawBase64Data, "base64");
      const extension = "png"; // Default extension

      const timestamp = Date.now();
      const filename = `${baseFilenamePrefix}_${timestamp}.${extension}`;
      const filepath = path.join(__dirname, "../uploads", subfolder, filename);

      const dir = path.dirname(filepath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(filepath, imageBuffer);
      return `/uploads/${subfolder}/${filename}`;
    }

    // const mimeType = matches[1]; // e.g., image/png
    const extension = matches[2]; // e.g., png
    const imageBuffer = Buffer.from(matches[3], "base64");

    const timestamp = Date.now();
    const filename = `${baseFilenamePrefix}_${timestamp}.${extension}`;
    const filepath = path.join(__dirname, "../uploads", subfolder, filename);

    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filepath, imageBuffer);
    return `/uploads/${subfolder}/${filename}`;
  } catch (error) {
    console.error(`Error saving base64 image to ${subfolder}:`, error);
    // Log the problematic base64 string's beginning for debugging (DON'T log the whole string)
    console.error(
      `Problematic base64 string (first 50 chars): ${base64String.substring(
        0,
        50
      )}`
    );
    return null;
  }
};

// @desc    Create new design
// @route   POST /api/designs
// @access  Private
const createDesign = asyncHandler(async (req, res) => {
  const {
    name,
    product,
    colorId,
    selectedColor,
    selectedSize,
    designData,
    description,
    isPublic,
    tags,
    mockupImageBase64, // New: base64 for mockup/preview image
    cleanDesignImageBase64, // New: base64 for clean design (for print)
  } = req.body;

  // Kiểm tra user hợp lệ
  if (!req.user || !req.user._id) {
    res.status(401);
    throw new Error("Not authorized: user not found");
  }
  // Kiểm tra product id hợp lệ
  if (!product) {
    res.status(400);
    throw new Error("Thiếu product id trong payload");
  }
  const productDoc = await Product.findById(product);
  if (!productDoc) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (!mockupImageBase64) {
    res.status(400);
    throw new Error("Thiếu ảnh mockup (mockupImageBase64)");
  }
  if (!cleanDesignImageBase64) {
    res.status(400);
    throw new Error("Thiếu ảnh thiết kế sạch (cleanDesignImageBase64)");
  }

  // Tính giá dựa trên size được chọn
  const selectedSizeObj = productDoc.sizes.find(
    (size) => size.name === selectedSize
  );
  if (!selectedSizeObj) {
    res.status(400);
    throw new Error("Size không hợp lệ");
  }

  // Calculate price based on baseCost structure
  let basePrice = 0;
  if (selectedSizeObj.baseCost) {
    // If petType is provided, use specific price, otherwise use dog price as default
    const petType = req.body.petType || "dog";
    basePrice =
      selectedSizeObj.baseCost[petType] || selectedSizeObj.baseCost.dog || 0;
  }

  const designFee = productDoc.designFee || 80000;
  const calculatedPrice = basePrice + designFee;

  // Validate calculated price
  if (isNaN(calculatedPrice) || calculatedPrice <= 0) {
    console.error("Price calculation error:", {
      selectedSize,
      baseCost: selectedSizeObj.baseCost,
      designFee,
      calculatedPrice,
    });
    res.status(400);
    throw new Error(
      "Không thể tính toán giá sản phẩm. Vui lòng kiểm tra thông tin size và sản phẩm."
    );
  }

  // Save images from base64
  const previewImagePath = saveBase64Image(
    mockupImageBase64,
    "designs_mockups",
    `design_mockup_${req.user._id}`
  );
  const printDesignImagePath = saveBase64Image(
    cleanDesignImageBase64,
    "designs_print",
    `design_print_${req.user._id}`
  );

  if (!previewImagePath) {
    res.status(500);
    throw new Error("Lỗi khi lưu ảnh mockup.");
  }
  if (!printDesignImagePath) {
    res.status(500);
    throw new Error("Lỗi khi lưu ảnh thiết kế sạch.");
  }

  const design = new Design({
    user: req.user._id,
    name,
    product,
    colorId,
    selectedColor,
    selectedSize,
    designData,
    previewImage: previewImagePath, // Path to saved mockup image
    printDesignImage: printDesignImagePath, // Path to saved clean design image
    calculatedPrice, // Lưu giá đã tính
    description,
    isPublic,
    tags,
  });

  const createdDesign = await design.save();
  await createdDesign.populate("product", "name type baseImageUrl");
  await createdDesign.populate("user", "profile email");

  res.status(201).json(createdDesign);
});

// @desc    Get user's designs
// @route   GET /api/designs/my
// @access  Private
const getUserDesigns = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6; // Default 6 designs per page
  const skip = (page - 1) * limit;

  const filter = { user: req.user._id };

  const designs = await Design.find(filter)
    .populate("product", "name type baseImageUrl")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalDesigns = await Design.countDocuments(filter);
  const totalPages = Math.ceil(totalDesigns / limit);

  res.json({
    designs,
    currentPage: page,
    totalPages,
    totalDesigns,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  });
});

// @desc    Get design by ID
// @route   GET /api/designs/:id
// @access  Private
const getDesignById = asyncHandler(async (req, res) => {
  const design = await Design.findById(req.params.id)
    .populate("product", "name type baseImageUrl mockupImageUrl colors")
    .populate("user", "profile email");

  if (!design) {
    res.status(404);
    throw new Error("Design not found");
  }

  // Check if user owns design hoặc design là public
  if (
    design.user._id.toString() !== req.user._id.toString() &&
    !design.isPublic
  ) {
    res.status(403);
    throw new Error("Access denied");
  }

  res.json(design);
});

// @desc    Update design
// @route   PUT /api/designs/:id
// @access  Private
const updateDesign = asyncHandler(async (req, res) => {
  const design = await Design.findById(req.params.id);

  if (!design) {
    res.status(404);
    throw new Error("Design not found");
  }

  // Check if user owns design
  if (design.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Access denied");
  }

  const {
    name,
    designData,
    selectedColor,
    colorId,
    selectedSize,
    description,
    isPublic,
    tags,
    mockupImageBase64, // New for update
    cleanDesignImageBase64, // New for update
  } = req.body;

  design.name = name || design.name;
  design.designData = designData || design.designData;
  design.selectedColor = selectedColor || design.selectedColor;
  design.colorId = colorId || design.colorId;

  // If size changed, recalculate price
  if (selectedSize && selectedSize !== design.selectedSize) {
    const productDoc = await Product.findById(design.product);
    if (productDoc) {
      const newSizeObj = productDoc.sizes.find(
        (size) => size.name === selectedSize
      );
      if (newSizeObj && newSizeObj.baseCost) {
        const petType = req.body.petType || "dog";
        const basePrice =
          newSizeObj.baseCost[petType] || newSizeObj.baseCost.dog || 0;
        const designFee = productDoc.designFee || 80000;
        const newCalculatedPrice = basePrice + designFee;

        if (!isNaN(newCalculatedPrice) && newCalculatedPrice > 0) {
          design.calculatedPrice = newCalculatedPrice;
        }
      }
    }
    design.selectedSize = selectedSize;
  }

  design.description = description || design.description;
  design.isPublic = isPublic !== undefined ? isPublic : design.isPublic;
  design.tags = tags || design.tags;

  // Regenerate/update images if new base64 data is provided
  // Or if designData/selectedColor changed, frontend should send new images
  if (mockupImageBase64) {
    // Consider deleting old image if necessary, or let them accumulate
    const newPreviewImagePath = saveBase64Image(
      mockupImageBase64,
      "designs_mockups",
      `design_mockup_${req.user._id}_updated`
    );
    if (newPreviewImagePath) {
      design.previewImage = newPreviewImagePath;
    } else {
      console.warn(`Failed to update mockup image for design ${design._id}`);
    }
  }

  if (cleanDesignImageBase64) {
    const newPrintDesignImagePath = saveBase64Image(
      cleanDesignImageBase64,
      "designs_print",
      `design_print_${req.user._id}_updated`
    );
    if (newPrintDesignImagePath) {
      design.printDesignImage = newPrintDesignImagePath;
    } else {
      console.warn(
        `Failed to update clean design image for design ${design._id}`
      );
    }
  }

  const updatedDesign = await design.save();
  await updatedDesign.populate("product", "name type baseImageUrl");
  // Optionally populate user if needed for response
  // await updatedDesign.populate("user", "profile email");

  res.json(updatedDesign);
});

// @desc    Delete design
// @route   DELETE /api/designs/:id
// @access  Private
const deleteDesign = asyncHandler(async (req, res) => {
  const design = await Design.findById(req.params.id);

  if (!design) {
    res.status(404);
    throw new Error("Design not found");
  }

  // Check if user owns design
  if (design.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Access denied");
  }

  await Design.findByIdAndDelete(req.params.id);
  res.json({ message: "Design deleted successfully" });
});

// @desc    Get public designs
// @route   GET /api/designs/public
// @access  Public
const getPublicDesigns = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, tags } = req.query;

  let filter = { isPublic: true };

  if (tags) {
    filter.tags = { $in: tags.split(",") };
  }

  const designs = await Design.find(filter)
    .populate("product", "name type baseImageUrl")
    .populate("user", "name")
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Design.countDocuments(filter);

  res.json({
    designs,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total,
  });
});

// @desc    Convert design to product for cart
// @route   POST /api/designs/:id/to-product
// @access  Private
const convertDesignToProduct = asyncHandler(async (req, res) => {
  const design = await Design.findById(req.params.id).populate("product");

  if (!design) {
    res.status(404);
    throw new Error("Design not found");
  }

  if (design.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to access this design");
  }

  // Create product-like object for cart
  const cartProduct = {
    _id: `design_${design._id}`,
    name: design.name || `Custom ${design.product.name}`,
    description: design.description || "Custom designed product",
    price: design.calculatedPrice, // Sử dụng giá đã tính
    imageUrl: design.previewImage,
    type: "custom-design",
    designId: design._id,
    baseProduct: design.product._id,
    customization: {
      size: design.selectedSize,
      color: design.selectedColor,
      designData: design.designData,
    },
  };

  res.json(cartProduct);
});

// @desc    Get all designs for admin
// @route   GET /api/designs/admin/all
// @access  Private (Admin only)
const getAllDesignsForAdmin = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Optional search by name or user
  const searchQuery = req.query.search || "";
  let filter = {};

  if (searchQuery) {
    filter = {
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
      ],
    };
  }

  const designs = await Design.find(filter)
    .populate("product", "name type baseImageUrl price")
    .populate("user", "firstName lastName email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalDesigns = await Design.countDocuments(filter);
  const totalPages = Math.ceil(totalDesigns / limit);

  res.json({
    designs,
    currentPage: page,
    totalPages,
    totalDesigns,
  });
});

// @desc    Upload image for design studio
// @route   POST /api/designs/upload-image
// @access  Private
const uploadImage = asyncHandler(async (req, res) => {
  const { imageBase64 } = req.body;

  if (!imageBase64) {
    res.status(400);
    throw new Error("Image data is required");
  }

  // Kiểm tra user hợp lệ
  if (!req.user || !req.user._id) {
    res.status(401);
    throw new Error("Not authorized: user not found");
  }

  try {
    // Save the uploaded image
    const imagePath = saveBase64Image(
      imageBase64,
      "designs",
      `design_${req.user._id}`
    );

    if (!imagePath) {
      res.status(500);
      throw new Error("Failed to save image");
    }

    // Return the full URL for the image
    const imageUrl = `${req.protocol}://${req.get("host")}${imagePath}`;

    res.json({
      success: true,
      imageUrl: imageUrl,
      imagePath: imagePath,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500);
    throw new Error("Server error while uploading image");
  }
});

module.exports = {
  createDesign,
  getUserDesigns,
  getDesignById,
  updateDesign,
  deleteDesign,
  getPublicDesigns,
  convertDesignToProduct,
  getAllDesignsForAdmin,
  uploadImage,
};
