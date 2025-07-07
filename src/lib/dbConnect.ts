// import mongoose from "mongoose";

// const MONGODB_URI = process.env.MONGODB_URI as string;

// if (!MONGODB_URI) {
//   throw new Error("Please define the MONGODB_URI environment variable");
// }

// export async function dbConnect(): Promise<typeof mongoose> {
//   return mongoose.connect(MONGODB_URI);
// }

// src/lib/dbConnect.ts
// src/lib/dbConnect.ts
// src/lib/dbConnect.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

const cached = global._mongoose || { conn: null, promise: null };

if (!global._mongoose) {
  global._mongoose = cached;
}

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
