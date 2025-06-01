import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, email, password, fullName, phone } = body;

    // Validate input
    if (!username || !email || !password || !fullName || !phone) {
      return NextResponse.json(
        { error: "Vui lòng điền đầy đủ thông tin" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const checkUserResponse = await fetch("http://localhost:3001/api/users");
    const users = await checkUserResponse.json();

    if (users.some((user: any) => user.email === email)) {
      return NextResponse.json(
        { error: "Email đã được sử dụng" },
        { status: 400 }
      );
    }

    // Create new user
    const newUser = {
      username,
      email,
      password, // In real app, this should be hashed
      fullName,
      phone,
      createdAt: new Date().toISOString(),
    };

    const response = await fetch("http://localhost:3001/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    if (!response.ok) {
      throw new Error("Failed to create user");
    }

    const createdUser = await response.json();

    return NextResponse.json(
      {
        message: "Đăng ký thành công",
        user: {
          id: createdUser.id,
          username: createdUser.username,
          email: createdUser.email,
          fullName: createdUser.fullName,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi đăng ký" },
      { status: 500 }
    );
  }
} 