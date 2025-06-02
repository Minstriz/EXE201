import { NextResponse } from 'next/server';
// Removed fs and path imports as we will use Mongoose
// import fs from 'fs';
// import path from 'path';
// Removed uuid import as we will use Mongoose for ID generation
// import { v4 as uuidv4 } from 'uuid';

import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// Removed usersFilePath constant
// const usersFilePath = path.join(process.cwd(), 'data', 'users.json');

export async function GET() {
  await dbConnect();
  try {
    // Fetch users from MongoDB using Mongoose model
    const users = await User.find({});
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    // Mongoose will automatically generate an _id (ObjectId)
    const newUser = await User.create(body);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error adding user:', error);
    // Handle duplicate key error (e.g., duplicate username or email)
    if (error.code === 11000) {
       return NextResponse.json({ message: 'Username or Email already exists' }, { status: 400 });
    }
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
} 