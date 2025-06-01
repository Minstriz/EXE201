import { NextResponse, NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

const ordersFilePath = path.join(process.cwd(), 'data', 'orders.json');

export async function PUT(req: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    const { orderId } = params;
    const updatedOrderData = await req.json();

    // Read existing data
    const fileContents = fs.readFileSync(ordersFilePath, 'utf8');
    const data = JSON.parse(fileContents);

    // Find the order and update
    const orderIndex = data.orders.findIndex((order: any) => order.id.toString() === orderId);
    if (orderIndex === -1) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // Only allow updating the 'status' field for now
    if (updatedOrderData.status) {
      data.orders[orderIndex].status = updatedOrderData.status;
    }

    // Write updated data back
    fs.writeFileSync(ordersFilePath, JSON.stringify(data, null, 2), 'utf8');

    return NextResponse.json({ message: 'Order updated successfully', order: data.orders[orderIndex] });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ message: 'Error updating order' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    const { orderId } = params;

    // Read existing data
    const fileContents = fs.readFileSync(ordersFilePath, 'utf8');
    const data = JSON.parse(fileContents);

    // Filter out the order to delete
    const initialLength = data.orders.length;
    data.orders = data.orders.filter((order: any) => order.id.toString() !== orderId);

    if (data.orders.length === initialLength) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // Write updated data back
    fs.writeFileSync(ordersFilePath, JSON.stringify(data, null, 2), 'utf8');

    return NextResponse.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ message: 'Error deleting order' }, { status: 500 });
  }
} 