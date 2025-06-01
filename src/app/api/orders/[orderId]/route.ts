import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ordersFilePath = path.join(process.cwd(), "data/orders.json");

// Helper function to read orders
const readOrders = () => {
  try {
    const data = fs.readFileSync(ordersFilePath, "utf8");
    return JSON.parse(data).orders;
  } catch (error) {
    return [];
  }
};

// Helper function to write orders
const writeOrders = (orders: any[]) => {
  try {
    fs.writeFileSync(ordersFilePath, JSON.stringify({ orders }, null, 2));
  } catch (error) {
    console.error("Error writing orders:", error);
  }
};

export async function GET(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const orders = readOrders();
    const order = orders.find((o: any) => o.id === parseInt(params.orderId));

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const body = await request.json();
    const { paymentId } = body;

    if (!paymentId) {
      return NextResponse.json(
        { error: "Payment ID is required" },
        { status: 400 }
      );
    }

    const orders = readOrders();
    const orderIndex = orders.findIndex((o: any) => o.id === parseInt(params.orderId));

    if (orderIndex === -1) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    orders[orderIndex] = {
      ...orders[orderIndex],
      paymentId,
      status: "completed",
      updatedAt: new Date().toISOString()
    };

    writeOrders(orders);

    return NextResponse.json(orders[orderIndex]);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 