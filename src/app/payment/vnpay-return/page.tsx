"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function VNPayReturnPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [transactionInfo, setTransactionInfo] = useState<{
    vnp_TxnRef?: string;
    vnp_Amount?: string;
    vnp_OrderInfo?: string;
    vnp_ResponseCode?: string;
    vnp_TransactionNo?: string;
    vnp_PayDate?: string;
    vnp_BankCode?: string;
  } | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      // Chuyển SearchParams thành object
      const params: { [key: string]: string } = {};
      searchParams.forEach((value, key) => {
        params[key] = value;
      });

      if (Object.keys(params).length === 0) {
        setPaymentStatus("failed"); // Không có tham số trả về
        toast.error("Không nhận được dữ liệu thanh toán từ VNPay.");
        return;
      }

      // Log params nhận được từ VNPay
      console.log("VNPay Return Params:", params);

      // Gửi tham số về API backend để xác minh chữ ký và cập nhật trạng thái đơn hàng
      try {
        const verifyResponse = await fetch("/api/verify-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
        });

        const data = await verifyResponse.json();

        console.log("Verify Payment Response:", data);

        if (verifyResponse.ok && data.RspCode === "00") {
          setPaymentStatus("success");
          setTransactionInfo({
            vnp_TxnRef: params.vnp_TxnRef,
            vnp_Amount: (parseInt(params.vnp_Amount) / 100).toLocaleString() + " VNĐ",
            vnp_OrderInfo: params.vnp_OrderInfo,
            vnp_ResponseCode: params.vnp_ResponseCode,
            vnp_TransactionNo: params.vnp_TransactionNo,
            vnp_PayDate: params.vnp_PayDate, // Cần format lại nếu muốn hiển thị đẹp
            vnp_BankCode: params.vnp_BankCode,
          });
          toast.success("Thanh toán thành công!");

          // TODO: Cập nhật trạng thái đơn hàng trong database/JSON file
          // Sử dụng data.orderId (nếu backend trả về) hoặc params.vnp_TxnRef

        } else {
          setPaymentStatus("failed");
          setTransactionInfo({
            vnp_ResponseCode: params.vnp_ResponseCode,
            vnp_TxnRef: params.vnp_TxnRef,
            vnp_OrderInfo: params.vnp_OrderInfo,
          });
          toast.error("Thanh toán thất bại hoặc chữ ký không hợp lệ.");
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        setPaymentStatus("failed");
        toast.error("Lỗi kết nối khi xác minh thanh toán.");
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="pt-20 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        {paymentStatus === null && (
          <p>Đang xử lý kết quả thanh toán...</p>
        )}
        {paymentStatus === "success" && transactionInfo && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-600 mb-4">Thanh toán thành công!</h2>
            <p className="text-gray-700 mb-2">Mã giao dịch VNPay: {transactionInfo.vnp_TransactionNo}</p>
            <p className="text-gray-700 mb-2">Mã đơn hàng: {transactionInfo.vnp_TxnRef}</p>
            <p className="text-gray-700 mb-2">Số tiền: {transactionInfo.vnp_Amount}</p>
            {/* <p className="text-gray-700 mb-2">Thời gian: {transactionInfo.vnp_PayDate}</p> */}
            <p className="text-gray-700 mb-4">Ngân hàng: {transactionInfo.vnp_BankCode}</p>
            <Button onClick={() => router.push("/")} className="mt-4 mr-2 bg-[#219EBC] hover:bg-[#197ba3]">Về trang chủ</Button>
            <Button onClick={() => router.push("/profile")} className="mt-4 bg-gray-500 hover:bg-gray-700">Xem đơn hàng</Button>
          </>
        )}
        {paymentStatus === "failed" && transactionInfo && (
           <>
           <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
           <h2 className="text-2xl font-bold text-red-600 mb-4">Thanh toán thất bại!</h2>
           <p className="text-gray-700 mb-2">Mã đơn hàng: {transactionInfo.vnp_TxnRef}</p>
           <p className="text-gray-700 mb-2">Mã phản hồi VNPay: {transactionInfo.vnp_ResponseCode}</p>
           <p className="text-gray-700 mb-4">Vui lòng thử lại hoặc liên hệ hỗ trợ nếu cần.</p>
           <Button onClick={() => router.push("/cart")} className="mt-4 mr-2 bg-red-500 hover:bg-red-700">Quay lại giỏ hàng</Button>
           <Button onClick={() => router.push("/")} className="mt-4 bg-gray-500 hover:bg-gray-700">Về trang chủ</Button>
         </>
        )}
         {paymentStatus === "failed" && !transactionInfo && (
           <>
           <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
           <h2 className="text-2xl font-bold text-red-600 mb-4">Thanh toán thất bại!</h2>
           <p className="text-gray-700 mb-4">Không nhận được dữ liệu phản hồi từ VNPay hoặc có lỗi xảy ra.</p>
           <Button onClick={() => router.push("/cart")} className="mt-4 mr-2 bg-red-500 hover:bg-red-700">Quay lại giỏ hàng</Button>
           <Button onClick={() => router.push("/")} className="mt-4 bg-gray-500 hover:bg-gray-700">Về trang chủ</Button>
         </>
        )}
      </div>
    </div>
  );
} 