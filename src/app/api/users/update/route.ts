import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const usersFilePath = path.join(process.cwd(), "src/data/users.json");

// Helper function to read users
const readUsers = () => {
  try {
    const data = fs.readFileSync(usersFilePath, "utf8");
    return JSON.parse(data).users;
  } catch (error) {
    return [];
  }
};

// Helper function to write users
const writeUsers = (users: any[]) => {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify({ users }, null, 2));
  } catch (error) {
    console.error("Error writing users:", error);
  }
};

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, fullName, email, phone, address, city, province } = body;

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const users = readUsers();
    const userIndex = users.findIndex((user: any) => user.id === id);

    if (userIndex === -1) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const updatedUser = {
      ...users[userIndex],
      fullName,
      email,
      phone,
      address,
      city,
      province,
    };

    users[userIndex] = updatedUser;
    writeUsers(users);

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 