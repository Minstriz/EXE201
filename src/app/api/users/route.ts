import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { username, fullName, email, phone, password } = body;

    if (!username || !fullName || !email || !phone || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
        const message = existingUser.username === username ? "Username already exists" : "Email already exists";
        return NextResponse.json({ error: message }, { status: 400 });
    }

    const newUser = new User({
      username,
      fullName,
      email,
      phone,
      password,
    });

    await newUser.save();

    return NextResponse.json(newUser);
  } catch (error: unknown) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    const email = searchParams.get("email");

    if (!username && !email) {
      return NextResponse.json(
        { error: "Username or email is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ $or: [{ username }, { email }] });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error: unknown) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 