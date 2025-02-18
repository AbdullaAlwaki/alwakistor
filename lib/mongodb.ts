import mongoose from 'mongoose';

const MONGODB_URI: string | undefined = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('❌ Please define the MONGODB_URI environment variable inside .env.local');
}

// تعريف `global.mongoose` في TypeScript
declare global {
  var mongoose: { conn: mongoose.Mongoose | null; promise: Promise<mongoose.Mongoose> | null };
}

// التأكد من عدم التعريف المكرر
global.mongoose = global.mongoose || { conn: null, promise: null };
const cached = global.mongoose;

async function dbConnect(): Promise<mongoose.Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    // هنا يتم التأكد من أن `MONGODB_URI` لن يكون undefined
    cached.promise = mongoose.connect(MONGODB_URI as string, opts);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
