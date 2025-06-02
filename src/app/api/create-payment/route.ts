import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, orderId } = body;

    // Lấy thông tin cấu hình từ biến môi trường
    const vnp_TmnCode = process.env.VNP_TMN_CODE;
    const vnp_HashSecret = process.env.VNP_HASH_SECRET;
    const vnp_Url = process.env.VNP_URL;
    const vnp_ReturnUrl = process.env.NEXT_PUBLIC_APP_URL + "/payment/vnpay-return"; // Sẽ tạo trang này sau

    if (!vnp_TmnCode || !vnp_HashSecret || !vnp_Url || !vnp_ReturnUrl) {
      throw new Error("Missing VNPay environment variables");
    }

    const date = new Date();
    const createDate = date.getFullYear().toString() +
      (date.getMonth() + 1).toString().padStart(2, '0') +
      date.getDate().toString().padStart(2, '0') +
      date.getHours().toString().padStart(2, '0') +
      date.getMinutes().toString().padStart(2, '0') +
      date.getSeconds().toString().padStart(2, '0');

    // Sử dụng trực tiếp orderId dạng chuỗi từ frontend
    const orderIdStr = orderId; // Đã là string từ frontend
    const orderInfo = `Thanh toan don hang ${orderIdStr}`;
    const orderType = "other";
    const locale = "vn";
    const currCode = "VND";
    const vnp_Params: { [key: string]: string | number } = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = vnp_TmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderIdStr;
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_OrderType'] = orderType;
    vnp_Params['vnp_Amount'] = amount * 100; // VNPay accepts amount in cents
    vnp_Params['vnp_ReturnUrl'] = vnp_ReturnUrl;
    vnp_Params['vnp_IpAddr'] = request.headers.get('x-forwarded-for') || "127.0.0.1";
    vnp_Params['vnp_CreateDate'] = createDate;

    // Sắp xếp các tham số theo thứ tự a-z và tạo chuỗi ký tự để ký
    const sortedParams = Object.keys(vnp_Params)
      .sort()
      .reduce((acc: { [key: string]: string | number }, key) => {
        acc[key] = vnp_Params[key];
        return acc;
      }, {});

    const signData = Object.keys(sortedParams)
      .map(key => {
         const value = sortedParams[key];
         // Chỉ encode các giá trị cho chuỗi ký tự băm (signData)
         return `${key}=${encodeURIComponent(value).replace(/%20/g, '+')}`;
      })
      .join('&');

    console.log("Sign Data (for hashing):", signData);
    
    // Tạo chữ ký
    const hmac = crypto.createHmac("sha512", vnp_HashSecret as string);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    
    // Thêm chữ ký vào params GỐC trước khi tạo URL
    vnp_Params['vnp_SecureHash'] = signed;

    console.log("Generated Signature:", signed);
    console.log("Final vnp_Params:", vnp_Params);

    // Tạo URL thanh toán - URLSearchParams tự động encode giá trị
    const stringifiedParams: Record<string, string> = {};
    Object.keys(vnp_Params).forEach(key => {
      stringifiedParams[key] = String(vnp_Params[key]);
    });
    const vnpUrl = `${vnp_Url}?${new URLSearchParams(stringifiedParams).toString()}`;

    console.log("Redirecting to:", vnpUrl);

    return NextResponse.json({ paymentUrl: vnpUrl });
  } catch (error: unknown) {
    console.error("Error creating payment:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create payment";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 