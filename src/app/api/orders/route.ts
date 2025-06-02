import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import mongoose from 'mongoose'; // Import mongoose to use Types.ObjectId

export async function POST(request: Request) {
  await dbConnect(); // Kết nối đến MongoDB
  try {
    const body = await request.json();
    const { userId, items, totalAmount, status, paymentId } = body;

    if (!userId || !items || !totalAmount) {
      return NextResponse.json(
        { error: "Missing required fields: userId, items, totalAmount" }, // More specific error message
        { status: 400 }
      );
    }

    // Create a new order using Mongoose model
    const newOrder = await Order.create({
      userId,
      items,
      totalAmount,
      status: status || "pending", // Default status to pending if not provided
      paymentId,
      createdAt: new Date(),
      // Mongoose will automatically add _id and updatedAt (if schema has it)
    });

    // Return the newly created order (including the MongoDB _id)
    // We will return the Mongoose document as is, which includes _id
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  await dbConnect(); // Ensure connection for GET as well
  try {
    const { searchParams } = new URL(req.url);
    const userIdString = searchParams.get('userId');

    if (!userIdString) {
      return NextResponse.json({ message: 'Missing userId parameter' }, { status: 400 });
    }

    // Convert the userId string to Mongoose ObjectId
    // Check if the provided userIdString is a valid ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userIdString)) {
       return NextResponse.json({ message: 'Invalid userId format' }, { status: 400 });
    }
    const userId = new mongoose.Types.ObjectId(userIdString);

    // Fetch orders from MongoDB for the specific user using ObjectId
    const orders = await Order.find({ userId: userId });

    // Return Mongoose documents directly. Frontend should handle _id.
    return NextResponse.json(orders, { status: 200 });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}

// Add other handlers (POST, PUT, DELETE) if needed for client-side order management 