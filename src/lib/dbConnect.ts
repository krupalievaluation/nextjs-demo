// import mongoose from "mongoose";

// const DATABASE_URL = process.env.DATABASE_URL as string;

// if (!DATABASE_URL) {
//   throw new Error("Please define the DATABASE_URL environment variable");
// }

// export async function dbConnect(): Promise<typeof mongoose> {
//   return mongoose.connect(DATABASE_URL);
// }

// src/lib/dbConnect.ts
// src/lib/dbConnect.ts
// src/lib/dbConnect.ts
import mongoose from "mongoose";

const DATABASE_URL = process.env.DATABASE_URL || "";

if (!DATABASE_URL) {
  throw new Error("Please define the DATABASE_URL environment variable");
}

const cached = global._mongoose || { conn: null, promise: null };

if (!global._mongoose) {
  global._mongoose = cached;
}

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(DATABASE_URL);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
