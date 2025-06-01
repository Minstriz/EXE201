import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userId, address, city, province } = body;

    if (!userId || !address || !city || !province) {
      return NextResponse.json(
        { error: "Vui lòng điền đầy đủ thông tin địa chỉ" },
        { status: 400 }
      );
    }

    // Get current user from mock backend (port 3001)
    const userResponse = await fetch(`http://localhost:3001/users/${userId}`);
    if (!userResponse.ok) {
      // If user not found in mock backend
       // Depending on your mock backend setup, you might need to handle 404 or other errors here.
       // For json-server, fetching a non-existent ID returns 404.
        const errorText = await userResponse.text(); // Read error response
       console.error(`Failed to fetch user ${userId} from mock backend: ${userResponse.status} - ${errorText}`);

      return NextResponse.json(
        { error: "Không tìm thấy người dùng trong hệ thống" }, // Changed message slightly
        { status: userResponse.status } // Pass through the status from the mock backend
      );
    }

    const user = await userResponse.json();

    // Update user address in the mock backend (port 3001)
    const updatedUser = {
      ...user,
      address,
      city,
      province,
    };

    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    });

    if (!response.ok) {
      const errorText = await response.text(); // Read error response
       console.error(`Failed to update user ${userId} address in mock backend: ${response.status} - ${errorText}`);
      throw new Error("Lỗi khi cập nhật địa chỉ người dùng"); // More general error message
    }

    const result = await response.json();

    // Return updated user info to the frontend
    return NextResponse.json({
      message: "Cập nhật địa chỉ thành công",
      user: {
        id: result.id,
        username: result.username,
        email: result.email,
        fullName: result.fullName,
        phone: result.phone,
        address: result.address,
        city: result.city,
        province: result.province,
      },
    });
  } catch (error: any) {
    console.error("API Update address error:", error);
    return NextResponse.json(
      { error: error.message || "Đã xảy ra lỗi máy chủ khi cập nhật địa chỉ" }, // Use error.message
      { status: 500 }
    );
  }
} 