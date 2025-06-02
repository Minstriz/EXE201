import { NextResponse } from "next/server";
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
  await dbConnect(); // Kết nối đến MongoDB
  try {
    const body = await request.json();
    const { username, email, password, fullName, phone, address, city, province } = body;

    // Validate input
    if (!username || !email || !password || !fullName || !phone) {
      return NextResponse.json(
        { error: "Vui lòng điền đầy đủ thông tin: username, email, password, fullName, phone" },
        { status: 400 }
      );
    }

    // Check if user already exists by email or username
    const existingUser = await User.findOne({ $or: [{ email: email }, { username: username }] });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email hoặc Username đã được sử dụng" },
        { status: 400 }
      );
    }

    // Create new user using Mongoose model
    const newUser = await User.create({
      username,
      email,
      password, // In real app, this should be hashed
      fullName,
      phone,
      address, // Thêm các trường address, city, province nếu có trong request
      city,
      province,
      createdAt: new Date(),
    });

    // Return the created user info (excluding password)
    const userResponse = newUser.toObject();
    delete userResponse.password;

    return NextResponse.json(
      {
        message: "Đăng ký thành công",
        user: userResponse,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
     // Handle duplicate key error explicitly
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Username or Email already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Đã xảy ra lỗi khi đăng ký" },
      { status: 500 }
    );
  }
} 