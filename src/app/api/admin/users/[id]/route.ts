import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import mongoose from 'mongoose';

// Định nghĩa kiểu RouteContext với params là Promise
type RouteContext = {
  params: { id: string };
};

export async function GET(request: NextRequest, context: RouteContext) {
  await connectDB();
  const { id } = await context.params; // Sửa lại: Thêm await

  console.log('API GET User: Received ID', id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid User ID' }, { status: 400 });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  await connectDB();
  const { id } = await context.params;

  console.log('API PUT User: Received ID', id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid User ID' }, { status: 400 });
  }

  try {
    const body = await request.json();
    console.log('API PUT User: Received Body', body);

    // Sử dụng findByIdAndUpdate để cập nhật trực tiếp
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: { role: body.role } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      console.log('API PUT User: User not found', id);
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    console.log('API PUT User: Successfully updated - Mongoose object', updatedUser.toObject());
    return NextResponse.json(updatedUser.toObject(), { status: 200 });
  } catch (error) {
    console.error('API PUT User: Error updating user', error);
    return NextResponse.json({ message: (error as Error).message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  await connectDB();
  const { id } = await context.params; // Sửa lại: Thêm await

  console.log('API DELETE User: Received ID', id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid User ID' }, { status: 400 });
  }

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}