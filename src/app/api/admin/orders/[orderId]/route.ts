import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import mongoose from 'mongoose';

// Định nghĩa kiểu RouteContext
type RouteContext = {
  params: Promise<{ orderId: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  await connectDB();
  const { orderId } = await context.params;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return NextResponse.json({ message: 'Invalid Order ID' }, { status: 400 });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  await connectDB();
  const { orderId } = await context.params;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return NextResponse.json({ message: 'Invalid Order ID' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const updatedOrder = await Order.findByIdAndUpdate(orderId, body, { new: true, runValidators: true });
    if (!updatedOrder) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  await connectDB();
  const { orderId } = await context.params;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return NextResponse.json({ message: 'Invalid Order ID' }, { status: 400 });
  }

  try {
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Order deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}