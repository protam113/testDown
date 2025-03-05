// lib/mongodb.ts
import { MongoClient as MongoClientValue, Db } from 'mongodb'; // Import MongoClient như một named export

const uri: string = process.env.MONGO_PUBLIC_URL || '';

if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}

let client: MongoClientValue; // Sử dụng type từ named export
let clientPromise: Promise<MongoClientValue>;

// Type declaration cho global mà không dùng namespace
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClientValue> | undefined;
}

async function initializeClient() {
  try {
    console.log('Initializing MongoDB client with URI:', uri.replace(/:mongo@.*@/, ':mongo@<hidden>@')); // Ẩn password trong log
    client = new MongoClientValue(uri);
    clientPromise = client.connect();
    console.log('MongoDB client initialized successfully');
    return clientPromise;
  } catch (error) {
    console.error('Failed to initialize MongoDB client:', error);
    throw error;
  }
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = initializeClient();
  }
  clientPromise = global._mongoClientPromise;
} else {
  initializeClient();
}

export async function connectToDatabase(): Promise<{ db: Db; client: MongoClientValue }> {
  try {
    console.log('Attempting to connect to database...');
    const connectedClient = await clientPromise;
    const db = connectedClient.db('registration');
    console.log('Successfully connected to database: registration');
    return { db, client: connectedClient };
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw new Error(`Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}