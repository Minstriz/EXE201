import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ordersFilePath = path.join(process.cwd(), "data/orders.json");

// Helper function to read orders
const readOrders = () => {
  try {
    const data = fs.readFileSync(ordersFilePath, "utf8");
    const orders = JSON.parse(data).orders;
    // Ensure IDs are numbers for finding max
    return orders.map((order: any) => ({
      ...order,
      id: parseInt(order.id) || 0 // Convert ID to number, default to 0 if parsing fails
    }));
  } catch (error) {
    return [];
  }
};

// Helper function to write orders
const writeOrders = (orders: any[]) => {
  try {
     // Convert IDs back to string before writing, if needed for consistency with frontend/VNPAY expectations
     // Based on your previous request to have 5-digit IDs, lets keep them as numbers here
     // and format them to string in frontend if needed for display.
    fs.writeFileSync(ordersFilePath, JSON.stringify({ orders }, null, 2));
  } catch (error) {
    console.error("Error writing orders:", error);
  }
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, items, totalAmount, status, paymentId } = body;

    if (!userId || !items || !totalAmount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const orders = readOrders();

    // Find the maximum existing order ID and generate a new one
    const maxOrderId = orders.reduce((max: number, order: any) => Math.max(max, order.id), 0);
    const newOrderId = maxOrderId + 1;

    const newOrder = {
      id: newOrderId, // Use the globally unique new ID
      userId: userId.toString(),
      items,
      totalAmount,
      status: status || "pending",
      paymentId,
      createdAt: new Date().toISOString(),
    };

    orders.push(newOrder);
    writeOrders(orders);

    // Return the newly created order with its assigned ID
    return NextResponse.json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const orders = readOrders();
    const userOrders = orders.filter((order: any) => order.userId === userId.toString());

    return NextResponse.json(userOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 