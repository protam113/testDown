// app/api/register/route.ts
import User from '@/model/User';
import connectMongoDB from '@/utils/mongoConnect';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Kết nối MongoDB
    await connectMongoDB();

    // Parse JSON body
    const body = await request.json();
    const { username, password } = body;

    // Validate đầu vào
    if (!username || !password) {
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
    console.error('Lỗi đăng ký:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Lỗi máy chủ',
        error: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}