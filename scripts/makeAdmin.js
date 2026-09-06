import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import mongoose from "mongoose";
import User from "../src/models/User.js";

async function makeAdmin() {
  const email = process.argv[2] || "testuser@seed.test";
  
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI missing in .env.local");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  
  const user = await User.findOneAndUpdate(
    { email },
    { role: "admin" },
    { new: true }
  );

  if (user) {
    console.log(`Successfully promoted ${email} to admin.`);
  } else {
    console.log(`User with email ${email} not found.`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

makeAdmin();
