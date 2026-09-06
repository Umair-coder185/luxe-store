import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import Brand from "../src/models/Brand.js";
import Category from "../src/models/Category.js";
import Product from "../src/models/Product.js";

const MONGODB_URI = process.env.MONGODB_URI;

const LUXURY_BRANDS = [
  { name: "Chanel", slug: "chanel", description: "Quilted flap bags, chain straps" },
  { name: "Hermès", slug: "hermes", description: "Birkin/Kelly structured top-handle bags, Herbag" },
  { name: "Louis Vuitton", slug: "louis-vuitton", description: "Monogram totes, shoulder bags, Keepall duffels" },
  { name: "Dior", slug: "dior", description: "Saddle bags, Lady Dior" },
  { name: "Bottega Veneta", slug: "bottega-veneta", description: "Woven leather (intrecciato) totes and pouches" },
  { name: "Prada", slug: "prada", description: "Nylon/leather crossbody and tote bags" },
  { name: "Gucci", slug: "gucci", description: "Structured backpacks, belt bags" }
];

async function seed() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not defined in .env.local");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  const createdBrands = [];
  
  for (const b of LUXURY_BRANDS) {
    let brand = await Brand.findOne({ slug: b.slug });
    if (!brand) {
      brand = await Brand.create({
        name: b.name,
        slug: b.slug,
        description: b.description,
      });
      console.log(`Created luxury brand: ${b.name}`);
    } else {
      console.log(`Brand already exists: ${b.name}`);
    }
    createdBrands.push(brand);
  }

  // Create a placeholder generic "Handbags" category to attach these to if not found
  let handbagsCategory = await Category.findOne({ slug: 'handbags' });
  if (!handbagsCategory) {
    handbagsCategory = await Category.create({ name: 'Handbags', slug: 'handbags', parent: null });
    console.log("Created 'Handbags' root category.");
  }

  // Seed a couple of generic products for each of these brands under handbags
  for (const brand of createdBrands) {
    const productCount = await Product.countDocuments({ brand: brand._id, category: handbagsCategory._id });
    if (productCount > 0) {
      console.log(`Brand ${brand.name} already has handbag products.`);
      continue;
    }

    const numProducts = faker.number.int({ min: 1, max: 2 });
    for (let i = 0; i < numProducts; i++) {
      const name = `${brand.name} Signature Handbag`;
      const price = faker.number.int({ min: 1500, max: 5000 }); // Luxury pricing

      await Product.create({
        name,
        slug: faker.helpers.slugify(`${name}-${faker.string.alphanumeric(5)}`).toLowerCase(),
        description: `An exquisite luxury handbag from ${brand.name}.`,
        price,
        images: [
          {
            url: `https://picsum.photos/seed/${faker.string.uuid()}/600/600`,
            publicId: `seed/${faker.string.uuid()}`,
          },
        ],
        category: handbagsCategory._id,
        brand: brand._id,
        stock: faker.number.int({ min: 1, max: 10 }), // Limited stock for luxury
        isActive: true,
      });
    }
    console.log(`Created ${numProducts} luxury handbags for: ${brand.name}`);
  }

  console.log("Luxury brands seeding complete.");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
