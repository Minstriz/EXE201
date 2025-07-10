"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React from "react";

export default function VnpayReturnPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Lấy các tham số cần thiết
  const responseCode = searchParams!.get("vnp_ResponseCode");
  const transactionStatus = searchParams!.get("vnp_TransactionStatus");
  const orderInfo = searchParams!.get("vnp_OrderInfo");
  const amount = searchParams!.get("vnp_Amount");

  // Xác định trạng thái thanh toán
  const isSuccess = responseCode === "00" && transactionStatus === "00";

  return (
    <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <h1>
        {isSuccess ? "Thanh toán thành công!" : "Thanh toán thất bại"}
      </h1>
      <p>
        {isSuccess
          ? `Cảm ơn bạn đã thanh toán. Đơn hàng: ${orderInfo || ""}, Số tiền: ${amount ? Number(amount) / 100 : ""} VND`
          : "Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại hoặc liên hệ hỗ trợ."}
      </p>
      <button
        style={{
          marginTop: 24,
          padding: "12px 24px",
          fontSize: 16,
          borderRadius: 8,
          background: "#0070f3",
          color: "#fff",
          border: "none",
          cursor: "pointer"
        }}
        onClick={() => router.push("/")}
      >
        Về trang chủ
      </button>
    </div>
  );
} 