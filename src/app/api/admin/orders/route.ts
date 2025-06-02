import { NextResponse } from 'next/server';
// Removed fs and path imports
// import fs from 'fs';
// import path from 'path';

import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
// Import the User model as we need it for population
import User from '@/models/User';
import mongoose from 'mongoose'; // Need mongoose here to access models

// Removed ordersFilePath constant
// const ordersFilePath = path.join(process.cwd(), 'data', 'orders.json');

// Connect to database
export async function GET() {
  await dbConnect();
  try {
    // Ensure User model is available from mongoose.models registry
    // This line forces Mongoose to check its registry.
    const UserModel = mongoose.models.User || User; // Use the imported User if not in models registry (unlikely after dbConnect imports)

    // Fetch orders from MongoDB using Mongoose model and populate the userId field
    const orders = await Order.find({}).populate({
      path: 'userId',
      select: 'fullName', // Only select the fullName field from the User document
      model: UserModel // Explicitly tell populate to use the UserModel we ensured is available
    });
    // Map Mongoose documents to plain objects for API response
    const plainOrders = orders.map(order => order.toObject());

    return NextResponse.json(plainOrders);
  } catch (error) {
    // Type assertion to treat error as Error for its message property
    console.error('Error fetching orders:', error);
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}

// Note: POST for orders (creating new orders) will likely be handled elsewhere in your app (e.g., checkout process),
// but if you need an admin endpoint to create orders, it would be added here, using Order.create() 