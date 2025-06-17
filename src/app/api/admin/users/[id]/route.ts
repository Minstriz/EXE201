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
  const { id } = await context.params; // Sửa lại: Thêm await

  console.log('API PUT User: Received ID', id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid User ID' }, { status: 400 });
  }

  try {
    const body = await request.json();
    console.log('API PUT User: Received Body', body);

    const userToUpdate = await User.findById(id);

    if (!userToUpdate) {
      console.log('API PUT User: User not found', id);
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Cập nhật trường role và lưu
    console.log('API PUT User: User before update', userToUpdate.toObject());
    userToUpdate.role = body.role;
    const updatedUser = await userToUpdate.save();

    console.log('API PUT User: Successfully updated - Mongoose object', updatedUser.toObject());

    // Thêm bước kiểm tra: Fetch lại user ngay sau khi update
    const reFetchedUser = await User.findById(id);
    console.log('API PUT User: Re-fetched user from DB', reFetchedUser ? reFetchedUser.toObject() : null);

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