import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import Brand from "../src/models/Brand.js";
import Category from "../src/models/Category.js";
import Product from "../src/models/Product.js";

const MONGODB_URI = process.env.MONGODB_URI;

const WATCH_BRANDS = [
  { name: "Rolex", slug: "rolex", description: "Consistently tops sales charts with legendary models like the Submariner, Daytona, and GMT-Master II." },
  { name: "Omega", slug: "omega", description: "Driven largely by the popularity of the Seamaster family and Constellation line." },
  { name: "Tudor", slug: "tudor", description: "Strong men's-focused affordable-luxury brand, historically tied to diver watches." },
  { name: "Cartier", slug: "cartier", description: "The Tank has design longevity spanning over a century and gender-neutral appeal." },
];

async function seed() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not defined in .env.local");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  const createdBrands = {};
  
  for (const b of WATCH_BRANDS) {
    let brand = await Brand.findOne({ slug: b.slug });
    if (!brand) {
      brand = await Brand.create({
        name: b.name,
        slug: b.slug,
        description: b.description,
      });
      console.log(`Created watch brand: ${b.name}`);
    } else {
      console.log(`Brand already exists: ${b.name}`);
    }
    createdBrands[b.slug] = brand;
  }

  // Find or Create Categories
  let mensWatches = await Category.findOne({ slug: 'mens-watches' });
  if (!mensWatches) {
    mensWatches = await Category.create({ name: "Men's Watches", slug: 'mens-watches', parent: null });
  }
  let womensWatches = await Category.findOne({ slug: 'womens-watches' });
  if (!womensWatches) {
    womensWatches = await Category.create({ name: "Women's Watches", slug: 'womens-watches', parent: null });
  }

  // Config mapping for products
  const productConfig = [
    { brand: 'rolex', cat: mensWatches, nameBase: 'Submariner Dive Watch' },
    { brand: 'rolex', cat: mensWatches, nameBase: 'Daytona Chronograph' },
    { brand: 'rolex', cat: womensWatches, nameBase: 'Lady-Datejust Classic' },
    { brand: 'omega', cat: mensWatches, nameBase: 'Seamaster Professional' },
    { brand: 'omega', cat: womensWatches, nameBase: 'Constellation Quartz' },
    { brand: 'tudor', cat: mensWatches, nameBase: 'Black Bay Diver' },
    { brand: 'tudor', cat: mensWatches, nameBase: 'Pelagos Titanium' },
    { brand: 'cartier', cat: womensWatches, nameBase: 'Tank Must Watch' },
    { brand: 'cartier', cat: womensWatches, nameBase: 'Panthère de Cartier' },
    { brand: 'cartier', cat: mensWatches, nameBase: 'Santos de Cartier' },
  ];

  for (const config of productConfig) {
    const brandObj = createdBrands[config.brand];
    if (!brandObj) continue;

    const name = `${brandObj.name} ${config.nameBase}`;
    const slug = faker.helpers.slugify(`${name}-${faker.string.alphanumeric(4)}`).toLowerCase();
    
    // Check if product exists roughly by name
    const existing = await Product.findOne({ name });
    if (!existing) {
      const price = faker.number.int({ min: 3000, max: 25000 });
      await Product.create({
        name,
        slug,
        description: `A masterpiece timepiece by ${brandObj.name}, representing the pinnacle of horology.`,
        price,
        images: [
          {
            url: `https://picsum.photos/seed/${faker.string.uuid()}/600/600`,
            publicId: `seed/${faker.string.uuid()}`,
          },
        ],
        category: config.cat._id,
        brand: brandObj._id,
        stock: faker.number.int({ min: 1, max: 5 }),
        isActive: true,
      });
      console.log(`Created watch product: ${name}`);
    } else {
      console.log(`Product already exists: ${name}`);
    }
  }

  console.log("Watches seeding complete.");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
