import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ordersFilePath = path.join(process.cwd(), "data/orders.json");

// Helper function to read orders
const readOrders = () => {
  try {
    const data = fs.readFileSync(ordersFilePath, "utf8");
    return JSON.parse(data).orders;
  } catch {
    return [];
  }
};

// Helper function to write orders
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const writeOrders = (orders: any[]) => {
  try {
    fs.writeFileSync(ordersFilePath, JSON.stringify({ orders }, null, 2));
  } catch (error) {
    console.error("Error writing orders:", error);
  }
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
    const vnp_TxnRef = searchParams.get("vnp_TxnRef");
    const vnp_TransactionNo = searchParams.get("vnp_TransactionNo");

    // Chuyển tất cả params thành query string để truyền qua trang kết quả
    const queryString = new URLSearchParams(searchParams).toString();

    if (!vnp_TxnRef) {
      return NextResponse.redirect(new URL(`/payment/vnpay-return?${queryString}`, request.url));
    }

    const orders = readOrders();
    const orderIndex = orders.findIndex((order: { id: number }) => order.id === parseInt(vnp_TxnRef));

    if (orderIndex === -1) {
      return NextResponse.redirect(new URL(`/payment/vnpay-return?${queryString}`, request.url));
    }

    // Cập nhật trạng thái đơn hàng dựa trên mã phản hồi
    orders[orderIndex] = {
      ...orders[orderIndex],
      status: vnp_ResponseCode === "00" ? "completed" : "failed",
      paymentId: vnp_TransactionNo,
      updatedAt: new Date().toISOString()
    };

    writeOrders(orders);

    // Chuyển hướng về trang kết quả với tất cả params
    return NextResponse.redirect(new URL(`/payment/vnpay-return?${queryString}`, request.url));

  } catch (error) {
    console.error("Error processing VNPay return:", error);
    return NextResponse.redirect(new URL("/payment/vnpay-return", request.url));
  }
} 