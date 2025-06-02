import { NextResponse } from "next/server";
import crypto from "crypto";
import fs from 'fs';
import path from 'path';
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import mongoose from 'mongoose';

const ordersFilePath = path.join(process.cwd(), 'src', 'data', 'orders.json');

// Helper function to read orders from the JSON file
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function readOrders() {
  try {
    const data = fs.readFileSync(ordersFilePath, 'utf8');
    return JSON.parse(data).orders;
  } catch (error) {
    console.error('Error reading orders.json:', error);
    return [];
  }
}

// Helper function to write orders to the JSON file
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
function writeOrders(orders: any[]) {
  try {
    fs.writeFileSync(ordersFilePath, JSON.stringify({ orders }, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing orders.json:', error);
  }
}

export async function POST(request: Request) {
  try {
    await connectDB(); // Connect to DB
    const params = await request.json();
    console.log("VNPay Verify Params:", params);

    const vnp_HashSecret = process.env.VNP_HASH_SECRET as string;

    if (!vnp_HashSecret) {
        console.error("Missing VNP_HASH_SECRET environment variable");
        return NextResponse.json({ RspCode: '99', Message: 'Missing secret config' });
    }

    // Lấy chữ ký từ VNPay gửi sang và xóa nó khỏi params để kiểm tra
    const receivedSecureHash = params['vnp_SecureHash'];
    delete params['vnp_SecureHash'];
    delete params['vnp_SecureHashType']; // VNPay có thể gửi thêm loại hash

    // Sắp xếp lại params và tạo chuỗi dữ liệu để kiểm tra chữ ký
    const sortedParams = Object.keys(params).sort().reduce((acc: Record<string, string>, key) => {
        acc[key] = params[key];
        return acc;
      }, {} as Record<string, string>);

    const signData = Object.keys(sortedParams)
      .map(key => {
         const value = sortedParams[key];
         // Mã hóa giá trị (trừ vnp_SecureHash nếu có) - Đảm bảo mã hóa đúng theo VNPay
         return `${key}=${encodeURIComponent(value).replace(/%20/g, '+')}`;
      })
      .join('&');

    console.log("Sign Data (for verification):", signData);

    // Tạo chữ ký trên dữ liệu nhận được
    const hmac = crypto.createHmac("sha512", vnp_HashSecret);
    const generatedSecureHash = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    console.log("Generated Secure Hash:", generatedSecureHash);
    console.log("Received Secure Hash:", receivedSecureHash);

    // So sánh chữ ký
    if (generatedSecureHash === receivedSecureHash) {
      // Chữ ký hợp lệ
      const rspCode = params['vnp_ResponseCode'];
      const orderId = params['vnp_TxnRef'];
      const vnpayTxnId = params['vnp_TransactionNo'];

      // Tìm đơn hàng bằng orderId (vnp_TxnRef) và cập nhật trạng thái
       // Kiểm tra xem orderId có phải là ObjectId hợp lệ không trước khi tìm
       if (!mongoose.Types.ObjectId.isValid(orderId)) {
            console.error("Invalid orderId received from VNPay:", orderId);
            return NextResponse.json({ RspCode: '01', Message: 'Invalid Order ID' });
        }

      const order = await Order.findById(orderId);

      if (!order) {
          console.error("Order not found for orderId:", orderId);
          return NextResponse.json({ RspCode: '01', Message: 'Order Not Found' });
      }

      // Cập nhật trạng thái đơn hàng dựa trên rspCode từ VNPay
      if (rspCode === '00') {
         order.status = 'paid'; // Hoặc trạng thái tương ứng cho 'đã thanh toán'
         order.paymentId = vnpayTxnId; // Lưu mã giao dịch VNPay
         console.log(`Payment success for order ${orderId}. Updating status to 'paid'.`);
      } else {
         order.status = 'failed'; // Hoặc trạng thái tương ứng cho 'thanh toán thất bại'
         console.log(`Payment failed for order ${orderId}. rspCode: ${rspCode}. Updating status to 'failed'.`);
      }
       order.updatedAt = new Date(); // Cập nhật thời gian cập nhật
       await order.save(); // Lưu thay đổi vào database

      // Trả về kết quả cho VNPay (quan trọng để VNPay xác nhận)
      if (rspCode === '00') {
         return NextResponse.json({ RspCode: '00', Message: 'Success' });
      } else {
         return NextResponse.json({ RspCode: '01', Message: 'Payment failed' });
      }

    } else {
      // Chữ ký không hợp lệ
      console.error("Invalid signature received from VNPay");
      // Không cập nhật trạng thái đơn hàng nếu chữ ký không hợp lệ
      return NextResponse.json({ RspCode: '97', Message: 'Invalid signature' });
    }

  } catch (error: unknown) {
    console.error("Error processing VNPay return:", error);
    // Trả về lỗi cho VNPay để họ thử lại nếu cần
    return NextResponse.json({ RspCode: '99', Message: 'Unknown error' });
  }
} 