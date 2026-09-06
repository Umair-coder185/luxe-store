import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import Category from "../src/models/Category.js";
import Product from "../src/models/Product.js";
import Brand from "../src/models/Brand.js";

const MONGODB_URI = process.env.MONGODB_URI;

const NEW_CATEGORIES = [
  { name: "Bag Charms & Accessories", slug: "bag-charms-accessories" },
  { name: "Jewelry", slug: "jewelry" },
  { name: "Hair Accessories", slug: "hair-accessories" },
  { name: "Scarves & Wraps", slug: "scarves-wraps" },
  { name: "Sunglasses & Eyewear", slug: "sunglasses-eyewear" },
  { name: "Belts", slug: "belts" },
];

async function seed() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not defined in .env.local");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  // Find or create "Women" category
  let womenCategory = await Category.findOne({ slug: "women" });
  if (!womenCategory) {
    console.log("'Women' category not found. Creating it...");
    womenCategory = await Category.create({ name: "Women", slug: "women", parent: null });
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
        parent: womenCategory._id,
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
      const name = `${faker.commerce.productAdjective()} ${category.name} Item`;
      const price = faker.number.int({ min: 20, max: 200 });

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

  console.log("Accessories seeding complete.");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
