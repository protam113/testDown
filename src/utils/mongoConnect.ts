import mongoose, { ConnectOptions } from 'mongoose';

const MONGO_URL = process.env.MONGO_PUBLIC_URL || '';

if (!MONGO_URL) {
  console.error('❌ Không tìm thấy URL kết nối MongoDB');
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
  // Nếu đã kết nối, trả về kết nối hiện tại
  if (cached.conn) {
    console.log('✅ Sử dụng kết nối MongoDB hiện tại');
    return cached.conn;
  }

  // Nếu chưa có promise kết nối, tạo mới
  if (!cached.promise) {
    console.log('🚀 Bắt đầu kết nối MongoDB');
    
    // Sử dụng các tùy chọn kết nối được hỗ trợ bởi mongoose
    const options: ConnectOptions = {
      autoIndex: true,
    };

    cached.promise = mongoose.connect(MONGO_URL, options).then((mongooseConnection) => {
      cached.conn = mongooseConnection.connection;
      console.log('✅ Kết nối MongoDB thành công');
      return mongooseConnection;
    });
  }

  try {
    await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    console.error('❌ Lỗi kết nối MongoDB:', e);
    throw e;
  }
}

// Xử lý ngắt kết nối khi ứng dụng dừng
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('🔌 Đóng kết nối MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi đóng kết nối MongoDB:', error);
    process.exit(1);
  }
});

export default connectMongoDB;