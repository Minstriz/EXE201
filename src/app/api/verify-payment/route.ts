import { NextResponse } from "next/server";
import crypto from "crypto";
import fs from 'fs';
import path from 'path';

const ordersFilePath = path.join(process.cwd(), 'src', 'data', 'orders.json');

// Helper function to read orders from the JSON file
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
function writeOrders(orders: any[]) {
  try {
    fs.writeFileSync(ordersFilePath, JSON.stringify({ orders }, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing orders.json:', error);
  }
}

export async function POST(request: Request) {
  try {
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
    const sortedParams = Object.keys(params).sort().reduce((acc: any, key) => {
        acc[key] = params[key];
        return acc;
      }, {});

    const signData = Object.keys(sortedParams)
      .map(key => {
         const value = sortedParams[key];
         // Mã hóa giá trị (trừ vnp_SecureHash nếu có)
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
      const payDate = params['vnp_PayDate'];

      // --- Bỏ qua logic tìm và cập nhật đơn hàng để demo trang thành công ---
      // Trong thực tế, bạn CẦN tìm đơn hàng bằng orderId và cập nhật trạng thái

      if (rspCode === '00') {
         // Nếu VNPay báo thành công và chữ ký hợp lệ, trả về thành công cho frontend
         // (Bỏ qua kiểm tra Order Not Found tạm thời)
         console.warn("DEMO MODE: Bypassing order lookup to show success page for rspCode 00.");
         return NextResponse.json({ RspCode: '00', Message: 'Success' });
      } else {
         // VNPay báo lỗi khác 00, xử lý như thất bại
         console.log(`Payment failed according to VNPay. rspCode: ${rspCode}`);
         return NextResponse.json({ RspCode: '01', Message: 'Payment failed' }); // Hoặc mã lỗi phù hợp
      }

      // --- Kết thúc phần bỏ qua logic demo ---

    } else {
      // Chữ ký không hợp lệ
      console.error("Invalid signature received from VNPay");
      return NextResponse.json({ RspCode: '97', Message: 'Invalid signature' });
    }

  } catch (error) {
    console.error("Error processing VNPay return:", error);
    return NextResponse.json({ RspCode: '99', Message: 'Unknown error' });
  }
} 