import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Vui lòng nhập email và mật khẩu" },
        { status: 400 }
      );
    }

    // Find user
    const response = await fetch("http://localhost:3001/users");
    if (!response.ok) {
      throw new Error("Không thể kết nối đến server");
    }

    const users = await response.json();
    const user = users.find(
      (u: any) => u.email === email && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { error: "Email hoặc mật khẩu không đúng" },
        { status: 401 }
      );
    }

    // Return user info without password
    return NextResponse.json({
      message: "Đăng nhập thành công",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        address: user.address,
        city: user.city,
        province: user.province,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: error.message || "Đã xảy ra lỗi khi đăng nhập" },
      { status: 500 }
    );
  }
} 