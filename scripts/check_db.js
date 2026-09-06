import mongoose from "mongoose";
import { dbConnect } from "../src/lib/db.js";
import Brand from "../src/models/Brand.js";

async function check() {
  await dbConnect();
  const brands = await Brand.find({});
  console.log("Brands:", brands.map(b => b.name));
  process.exit(0);
}

check().catch(console.error);
