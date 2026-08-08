// lib/db.js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in .env.local"
  );
}

// Cache the connection across hot reloads (dev) and serverless invocations (prod).
// Without this, every file that imports dbConnect() would open a NEW connection.
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn; // reuse existing connection
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // fail fast instead of silently queueing ops
      maxPoolSize: 10, // cap concurrent connections per instance
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null; // reset so the next request can retry
    throw err;
  }

  return cached.conn;
}

export default dbConnect;