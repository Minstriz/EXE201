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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, fullName, email, phone, password } = body;

    if (!username || !fullName || !email || !phone || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const users = readUsers();

    // Check if username or email already exists
    if (users.some((user: any) => user.username === username)) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 }
      );
    }

    if (users.some((user: any) => user.email === email)) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    const newUser = {
      id: users.length + 1,
      username,
      fullName,
      email,
      phone,
      password,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    writeUsers(users);

    return NextResponse.json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    const email = searchParams.get("email");

    if (!username && !email) {
      return NextResponse.json(
        { error: "Username or email is required" },
        { status: 400 }
      );
    }

    const users = readUsers();
    const user = users.find(
      (user: any) =>
        user.username === username || user.email === email
    );

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 