import { NextResponse } from "next/server";
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function PUT(request: Request) {
  await dbConnect(); // Kết nối đến MongoDB
  try {
    const body = await request.json();
    // Log the received body
    console.log("Request body:", body);

    // Destructure all potentially updatable user fields from the body
    const { userId, fullName, email, phone, address, city, province } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    // Check if the userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: 'Invalid User ID' }, { status: 400 });
    }

    // Find user by ID and update all provided fields in MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { // Include all fields that can be updated
        fullName,
        email,
        phone,
        address,
        city,
        province
      },
      { new: true, runValidators: true } // new: true returns the updated document
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Không tìm thấy người dùng" },
        { status: 404 }
      );
    }

    // Return updated user info (excluding password)
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    return NextResponse.json({
      message: "Cập nhật địa chỉ thành công",
      user: userResponse,
    });
  } catch (error: unknown) {
    console.error("API Update address error:", error);
    let errorMessage = "Đã xảy ra lỗi máy chủ khi cập nhật địa chỉ";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 