import { NextResponse } from "next/server";
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
  await dbConnect(); // Kết nối đến MongoDB
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Vui lòng nhập email và mật khẩu" },
        { status: 400 }
      );
    }

    // Find the user in the database based on email
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // In a real app, you would compare the hashed password here
    // For this example, a simple string comparison (replace with bcrypt.compare)
    if (user.password !== password) { // NOTE: Replace with secure password comparison
       return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Return user data (excluding password) upon successful login
    // Ensure _id is returned
    const userObject = user.toObject();
    delete userObject.password;

    return NextResponse.json({ user: userObject }, { status: 200 });
  } catch (error) { // Fix for @typescript-eslint/no-explicit-any - Removed : any
    // Type assertion to treat error as Error for its message property
    console.error('Login error:', error);
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
} 