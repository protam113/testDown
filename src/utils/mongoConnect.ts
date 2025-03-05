import mongoose from 'mongoose';

const MONGO_URL = process.env.MONGO_PUBLIC_URL || '';

if (!MONGO_URL) {
  throw new Error('Please define the MONGO_PUBLIC_URL environment variable');
}

interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Mongoose> | null;
}

const globalWithMongoose = global as typeof global & {
  mongoose?: MongooseCache;
};

let cached: MongooseCache = { conn: null, promise: null };

if (globalWithMongoose.mongoose) {
  cached = globalWithMongoose.mongoose;
}

async function connectMongoDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URL, {
      autoIndex: true,
    }).then((mongooseConnection) => {
      cached.conn = mongooseConnection.connection;
      return mongooseConnection;
    });
  }

  try {
    await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    console.error('MongoDB connection error:', e);
    throw e;
  }
}

export default connectMongoDB;