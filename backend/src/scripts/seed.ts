import dotenv from "dotenv";
import mongoose from "mongoose";

import User from "../models/User";
import Description from "../models/Description";
//todo fix for all
const MONGO_URI = "mongodb://localhost:27017/himdraftai";
const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected");

    // Clean existing data
    await User.deleteMany({});
    await Description.deleteMany({});

    // Create users
    const users = await User.insertMany([
      {
        name: "Ujjwal Sharma",
        email: "ujjwal@example.com",
        passwordHash: "dummyhash123",
        provider: "local",
      },
      {
        name: "HimShakti Admin",
        email: "admin@himshakti.com",
        passwordHash: "dummyhash123",
        provider: "local",
      },
    ]);

    // Create descriptions
    await Description.insertMany([
      {
        userId: users[0]._id,
        productName: "Himalayan Ragi Cookies",
        ingredients: ["Ragi Flour", "Jaggery", "Desi Ghee"],
        weight: "250g",
        features: ["No preservatives", "Millet based", "Traditional recipe"],
        tone: "health",
        generatedDescription:
          "Nutritious Himalayan Ragi Cookies made with wholesome millet flour, natural jaggery, and pure desi ghee. A healthy and preservative-free snack inspired by traditional Himalayan recipes.",
      },
      {
        userId: users[0]._id,
        productName: "Buransh Flower Squash",
        ingredients: ["Buransh Flower Extract", "Sugar", "Water"],
        weight: "750ml",
        features: ["Refreshing", "Traditional recipe", "Natural ingredients"],
        tone: "traditional",
        generatedDescription:
          "Experience the authentic taste of the Himalayas with this refreshing Buransh Flower Squash prepared from handpicked rhododendron flowers.",
      },
      {
        userId: users[0]._id,
        productName: "Mixed Millet Flour",
        ingredients: ["Ragi", "Jowar", "Bajra"],
        weight: "1kg",
        features: ["High fiber", "Rich in nutrients", "Stone-ground"],
        tone: "health",
        generatedDescription:
          "A wholesome blend of nutrient-rich millets carefully processed to preserve their natural goodness. Perfect for rotis, porridge, and healthy recipes.",
      },
      {
        userId: users[1]._id,
        productName: "Himalayan Mango Pickle",
        ingredients: ["Raw Mango", "Mustard Oil", "Traditional Spices"],
        weight: "500g",
        features: ["Homestyle recipe", "Handcrafted", "No artificial colors"],
        tone: "traditional",
        generatedDescription:
          "Prepared using a cherished Himalayan recipe, this handcrafted mango pickle delivers the perfect balance of tangy mangoes and aromatic spices.",
      },
      {
        userId: users[1]._id,
        productName: "Apricot Jam",
        ingredients: ["Fresh Apricots", "Sugar", "Lemon Juice"],
        weight: "300g",
        features: [
          "Made from Himalayan apricots",
          "Rich fruit flavor",
          "No artificial flavors",
        ],
        tone: "premium",
        generatedDescription:
          "Crafted from handpicked Himalayan apricots, this premium jam offers a rich fruity taste and smooth texture for a delightful breakfast experience.",
      },
      {
        userId: users[1]._id,
        productName: "Apple Cinnamon Preserve",
        ingredients: ["Himalayan Apples", "Cinnamon", "Sugar"],
        weight: "350g",
        features: [
          "Small-batch production",
          "Premium ingredients",
          "Artisan recipe",
        ],
        tone: "premium",
        generatedDescription:
          "An artisan preserve made from crisp Himalayan apples and warm cinnamon, offering a luxurious and comforting spread.",
      },
    ]);

    console.log("Database seeded successfully");

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
