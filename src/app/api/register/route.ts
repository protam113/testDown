import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '../../../utils/mongoConnect';
import User from '@/model/User';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Bắt đầu quá trình đăng ký');
    
    // Kết nối MongoDB
    await connectMongoDB();
    console.log('📦 Đã kết nối MongoDB');

    // Parse JSON body
    let body;
    try {
      body = await request.json();
      console.log('📝 Dữ liệu nhận được:', body);
    } catch (parseError) {
      console.error('❌ Lỗi parse JSON:', parseError);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Dữ liệu không hợp lệ',
          error: parseError instanceof Error ? parseError.message : 'Lỗi không xác định'
        }, 
        { status: 400 }
      );
    }

    const { username, password } = body;

    // Validate đầu vào
    if (!username || !password) {
      console.warn('⚠️ Thiếu username hoặc password');
      return NextResponse.json(
        { 
          success: false, 
          message: 'Vui lòng nhập đầy đủ username và password' 
        }, 
        { status: 400 }
      );
    }

    // Kiểm tra tồn tại username
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.warn(`⚠️ Username ${username} đã tồn tại`);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Username đã tồn tại' 
        }, 
        { status: 400 }
      );
    }

    // Tạo user mới
    const newUser = new User({ username, password });
    await newUser.save();

    console.log(`✅ Tạo user ${username} thành công`);

    return NextResponse.json(
      { 
        success: true,
        message: 'Đăng ký thành công',
        user: { 
          username: newUser.username 
        } 
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Lỗi đăng ký chi tiết:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Lỗi máy chủ',
        error: error instanceof Error ? error.message : 'Lỗi không xác định'
      }, 
      { status: 500 }
    );
  }
}