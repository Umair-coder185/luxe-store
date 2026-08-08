// scripts/dropIndex.js
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

async function dropStaleIndex() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  const collection = mongoose.connection.collection("categories");

  // List current indexes so you can see exactly what's there before touching anything
  const indexes = await collection.indexes();
  console.log("Current indexes on categories:", indexes);

  // Drop the stale unique index on `name`
  try {
    await collection.dropIndex("name_1");
    console.log('Dropped index "name_1" successfully.');
  } catch (err) {
    console.log("Could not drop name_1 (may not exist):", err.message);
  }

  await mongoose.disconnect();
  process.exit(0);
}

dropStaleIndex().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});