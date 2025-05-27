const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Order = require("./models/Order");
const User = require("./models/User");

// Load env vars
dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedOrders = async () => {
  try {
    // Find the user
    const user = await User.findOne({ email: "john@email.com" });
    if (!user) {
      console.log("User not found");
      process.exit(1);
    }

    // Sample orders data
    const sampleOrders = [
      {
        user: user._id,
        items: [
          {
            name: "Áo thun cho chó",
            quantity: 2,
            price: 750000,
          },
          {
            name: "Vòng cổ cho mèo",
            quantity: 1,
            price: 350000,
          },
        ],
        total: 1850000,
        status: "delivered",
        shippingAddress: {
          address: "123 Đường Nguyễn Văn Linh",
          city: "Hồ Chí Minh",
          postalCode: "700000",
          country: "Việt Nam",
        },
        paymentMethod: "vnpay",
        createdAt: new Date("2024-03-15"),
      },
      {
        user: user._id,
        items: [
          {
            name: "Váy cho mèo",
            quantity: 1,
            price: 1200000,
          },
        ],
        total: 1200000,
        status: "shipping",
        shippingAddress: {
          address: "123 Đường Nguyễn Văn Linh",
          city: "Hồ Chí Minh",
          postalCode: "700000",
          country: "Việt Nam",
        },
        paymentMethod: "cod",
        createdAt: new Date("2024-03-20"),
      },
      {
        user: user._id,
        items: [
          {
            name: "Đồ chơi cho chó",
            quantity: 3,
            price: 250000,
          },
          {
            name: "Thức ăn cho mèo",
            quantity: 2,
            price: 450000,
          },
        ],
        total: 1650000,
        status: "processing",
        shippingAddress: {
          address: "123 Đường Nguyễn Văn Linh",
          city: "Hồ Chí Minh",
          postalCode: "700000",
          country: "Việt Nam",
        },
        paymentMethod: "vnpay",
        createdAt: new Date("2024-03-25"),
      },
    ];

    // Delete existing orders for this user
    await Order.deleteMany({ user: user._id });

    // Insert new orders
    await Order.insertMany(sampleOrders);

    console.log("Sample orders created successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding orders:", error);
    process.exit(1);
  }
};

seedOrders();
