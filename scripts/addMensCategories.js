import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import Category from "../src/models/Category.js";
import Product from "../src/models/Product.js";
import Brand from "../src/models/Brand.js";

const MONGODB_URI = process.env.MONGODB_URI;

const NEW_CATEGORIES = [
  { name: "Analog Quartz Watches", slug: "analog-quartz-watches" },
  { name: "Digital Sports Watches", slug: "digital-sports-watches" },
  { name: "Personalized Watches", slug: "personalized-watches" },
  { name: "Apple Watch Bands", slug: "apple-watch-bands" },
  { name: "Chains & Necklaces", slug: "mens-chains-necklaces" },
  { name: "Bracelets", slug: "mens-bracelets" },
  { name: "Rings", slug: "mens-rings" },
  { name: "Crossbody Bags", slug: "mens-crossbody-bags" },
  { name: "Sling Bags", slug: "mens-sling-bags" },
  { name: "Messenger Bags", slug: "mens-messenger-bags" },
  { name: "Polarized Aviators", slug: "polarized-aviators" },
  { name: "Sports Sunglasses", slug: "sports-sunglasses" },
  { name: "Blue-Light Blocking", slug: "blue-light-blocking" },
  { name: "Eyewear Accessories", slug: "eyewear-accessories" },
];

async function seed() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not defined in .env.local");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  // Find or create "Men" category
  let menCategory = await Category.findOne({ slug: "men" });
  if (!menCategory) {
    console.log("'Men' category not found. Creating it...");
    menCategory = await Category.create({ name: "Men", slug: "men", parent: null });
  }

  // Ensure we have at least one brand for the products
  let brand = await Brand.findOne({});
  if (!brand) {
    console.log("No brands found. Creating a default brand...");
    brand = await Brand.create({
      name: "Luxe Standard",
      slug: "luxe-standard",
      description: "Default brand for seeded products",
    });
  }

  const createdCategories = [];

  for (const cat of NEW_CATEGORIES) {
    // Check if category already exists
    let category = await Category.findOne({ slug: cat.slug });
    if (!category) {
      category = await Category.create({
        name: cat.name,
        slug: cat.slug,
        parent: menCategory._id,
      });
      console.log(`Created category: ${cat.name}`);
    } else {
      console.log(`Category already exists: ${cat.name}`);
    }
    createdCategories.push(category);
  }

  // Create 1-2 products per category
  for (const category of createdCategories) {
    // Check if category already has products
    const productCount = await Product.countDocuments({ category: category._id });
    if (productCount > 0) {
      console.log(`Category ${category.name} already has ${productCount} products. Skipping product creation.`);
      continue;
    }

    const numProducts = faker.number.int({ min: 1, max: 2 });
    for (let i = 0; i < numProducts; i++) {
      const name = `${faker.commerce.productAdjective()} Men's ${category.name}`;
      const price = faker.number.int({ min: 30, max: 300 });

      await Product.create({
        name,
        slug: faker.helpers.slugify(`${name}-${faker.string.alphanumeric(5)}`).toLowerCase(),
        description: faker.commerce.productDescription(),
        price,
        images: [
          {
            url: `https://picsum.photos/seed/${faker.string.uuid()}/600/600`,
            publicId: `seed/${faker.string.uuid()}`,
          },
        ],
        category: category._id,
        brand: brand._id,
        stock: faker.number.int({ min: 10, max: 50 }),
        isActive: true,
      });
    }
    console.log(`Created ${numProducts} products for category: ${category.name}`);
  }

  console.log("Men's categories seeding complete.");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
