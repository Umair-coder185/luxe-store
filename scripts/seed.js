// scripts/seed.js
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import Category from "../src/models/Category.js";
import Product from "../src/models/Product.js";
import User from "../src/models/User.js";
import Order from "../src/models/Order.js";

const MONGODB_URI = process.env.MONGODB_URI;

const CATEGORY_TREE = [
  { name: "Men", children: ["Shirts", "T-Shirts", "Jeans", "Shoes"] },
  { name: "Women", children: ["Dresses", "Tops", "Jeans", "Shoes"] },
];

const BRANDS = ["Urbano", "Nordic Fit", "Coastal", "Ironline", "Wildmark"];

// Hand-written names for demo/portfolio screenshots — mixed in with faker output
// so the product grid doesn't read as obviously auto-generated.
const CURATED_NAMES = {
  Shirts: ["Classic Oxford Button-Down", "Slim Fit Linen Shirt"],
  Jeans: ["Slim Fit Dark Wash Jeans", "Straight Leg Stretch Denim"],
  Dresses: ["Wrap Midi Dress", "Sleeveless Summer Dress"],
  Shoes: ["Everyday Leather Sneakers", "Classic Canvas Low-Tops"],
};

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  // 1. WIPE existing seed data — makes this script safely re-runnable.
  await Promise.all([
    Category.deleteMany({}),
    Product.deleteMany({}),
    Order.deleteMany({}),
    User.deleteMany({ email: /@seed\.test$/ }),
  ]);
  console.log("Cleared previous seed data");

  // 2. CREATE top-level + child categories
  const categoryDocs = [];
  for (const top of CATEGORY_TREE) {
    const parent = await Category.create({
      name: top.name,
      slug: top.name.toLowerCase(),
      parent: null,
    });
    categoryDocs.push(parent);

    const children = top.children.map((childName) => ({
      name: childName,
      slug: `${top.name.toLowerCase()}-${childName.toLowerCase().replace(/\s+/g, "-")}`,
      parent: parent._id,
    }));

    const createdChildren = await Category.insertMany(children);
    categoryDocs.push(...createdChildren);
  }
  console.log(`Created ${categoryDocs.length} categories`);

  const leafCategories = categoryDocs.filter((c) => c.parent !== null);

  // 3. BUILD product objects in memory first
  const products = [];
  const PRODUCTS_PER_CATEGORY = 5;

  for (const category of leafCategories) {
    const curatedForThisCategory = CURATED_NAMES[category.name] || [];

    for (let i = 0; i < PRODUCTS_PER_CATEGORY; i++) {
      // First 1-2 products per category use curated names, rest use faker
      const name =
        curatedForThisCategory[i] ||
        `${faker.commerce.productAdjective()} ${category.name}`;

      const price = faker.number.int({ min: 15, max: 120 });
      const hasDiscount = faker.datatype.boolean();

      products.push({
        name,
        slug: faker.helpers.slugify(`${name}-${faker.string.alphanumeric(5)}`).toLowerCase(),
        description: faker.commerce.productDescription(),
        price,
        compareAtPrice: hasDiscount ? price + faker.number.int({ min: 5, max: 30 }) : undefined,
        images: [
          {
            url: `https://picsum.photos/seed/${faker.string.uuid()}/600/600`,
            publicId: `seed/${faker.string.uuid()}`,
          },
        ],
        category: category._id,
        brand: faker.helpers.arrayElement(BRANDS),
        stock: faker.number.int({ min: 0, max: 100 }),
        salesCount: faker.number.int({ min: 0, max: 500 }),
        isActive: true,
      });
    }
  }

  // insertMany — one bulk write, not 40 separate .create() calls
  const createdProducts = await Product.insertMany(products);
  console.log(`Created ${createdProducts.length} products`);

  // 4. Create test user — .save() is required here (not insertMany) so the
  //    pre('save') hashing hook actually fires. See Step 3 notes.
  const testUser = new User({
    name: "Test User",
    email: "testuser@seed.test",
    passwordHash: "Password123!",
    addresses: [
      {
        label: "Home",
        fullName: "Test User",
        phone: "0300-1234567",
        street: "123 Main Boulevard",
        city: "Lahore",
        state: "Punjab",
        zip: "54000",
        country: "Pakistan",
        isDefault: true,
      },
    ],
  });
  await testUser.save();
  console.log("Created test user (testuser@seed.test / Password123!)");

  // 5. SEED ORDERS — using the same fields your real checkout flow will write.
  //    Built the same way checkout will build them: snapshot items, computed
  //    totals, initial statusHistory entry. This is what makes "My Orders"
  //    and the admin queue testable without placing a real order first.
  const shippingAddress = testUser.addresses[0].toObject();
  delete shippingAddress._id;

  const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered"];
  const orders = [];

  for (let i = 0; i < 5; i++) {
    // Pick 1-3 random products for this order
    const orderProducts = faker.helpers.arrayElements(
      createdProducts,
      faker.number.int({ min: 1, max: 3 })
    );

    const items = orderProducts.map((p) => {
      const quantity = faker.number.int({ min: 1, max: 2 });
      return {
        product: p._id,
        name: p.name,
        image: p.images[0].url,
        price: p.price, // frozen at "purchase" price, per Order schema design
        quantity,
      };
    });

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = subtotal > 100 ? 0 : 10;
    const tax = Math.round(subtotal * 0.05 * 100) / 100; // 5% tax, rounded to cents
    const total = subtotal + shippingFee + tax;

    const status = ORDER_STATUSES[i % ORDER_STATUSES.length];

    orders.push({
      orderNumber: `ORD-${Date.now()}-${1000 + i}`,
      user: testUser._id,
      items,
      shippingAddress,
      subtotal,
      shippingFee,
      tax,
      total,
      paymentStatus: status === "pending" ? "pending" : "paid",
      status,
      statusHistory: [
        { status: "pending", changedAt: new Date(Date.now() - 86400000 * (5 - i)) },
        ...(status !== "pending" ? [{ status, changedAt: new Date() }] : []),
      ],
    });
  }

  // insertMany is safe here — Order has no password-style pre-save hashing hook,
  // so there's no hook-skipping issue like there was with User.
  await Order.insertMany(orders);
  console.log(`Created ${orders.length} orders`);

  console.log("Seed complete.");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});