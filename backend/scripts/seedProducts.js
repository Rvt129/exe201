// Script seed sản phẩm với ảnh mockup base64
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Product = require("../models/Product");
const Category = require("../models/Category");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/exe201";

async function encodeImageToBase64(filePath) {
  const img = fs.readFileSync(filePath);
  const ext = path.extname(filePath).replace(".", "");
  return `data:image/${ext};base64,${img.toString("base64")}`;
}

async function seed() {
  await mongoose.connect(MONGO_URI);

  // Tạo category mẫu nếu chưa có
  let category = await Category.findOne({ name: "Áo Thun" });
  if (!category) {
    category = await Category.create({
      name: "Áo Thun",
      description: "Áo thun thú cưng",
    });
  }

  // Danh sách màu và file ảnh tương ứng
  const colorFiles = [
    { name: "Trắng", hexCode: "#ffffff", file: "Trắng.png" },
    { name: "Hồng", hexCode: "#ffb6c1", file: "Hồng.png" },
    { name: "Tím", hexCode: "#b39ddb", file: "Tím.png" },
    { name: "Vàng", hexCode: "#fff176", file: "Vàng.png" },
    { name: "Xanh dương", hexCode: "#64b5f6", file: "Xanh dương.png" },
    {
      name: "Xanh dương mint",
      hexCode: "#a7ffeb",
      file: "Xanh dương mint.png",
    },
    { name: "Xanh lá", hexCode: "#81c784", file: "Xanh lá.png" },
  ];

  const colors = [];
  for (const c of colorFiles) {
    const imgPath = path.join(
      __dirname,
      "../../frontend/public/assets/images",
      c.file
    );
    const mockupImageUrl = await encodeImageToBase64(imgPath);
    colors.push({
      name: c.name,
      hexCode: c.hexCode,
      mockupImageUrl,
      isAvailable: true,
    });
  }

  // Seed sản phẩm
  const product = new Product({
    name: "Áo Thun Thú Cưng",
    category: category._id,
    basePrice: 120000,
    description: "Áo thun cho thú cưng, nhiều màu sắc.",
    type: "pet_tshirt",
    sizes: [
      { name: "XS" },
      { name: "S" },
      { name: "M" },
      { name: "L" },
      { name: "XL" },
      { name: "XXL" },
    ],
    colors,
    available: true,
    isCustomizable: true,
  });

  await Product.deleteMany({}); // Xóa sản phẩm cũ để seed lại
  await product.save();
  console.log("Seeded product with mockup images base64 thành công!");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
