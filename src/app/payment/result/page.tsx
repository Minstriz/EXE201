"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const status = searchParams.get("status");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 pt-24 pb-12 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 text-center max-w-lg">
        {status === "qr_waiting" ? (
          <>
            <CheckCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Đơn hàng của bạn đang được xác nhận thanh toán!
            </h1>
            <p className="text-gray-600 mb-8">
              Vui lòng chờ nhân viên xác nhận thanh toán chuyển khoản của bạn. Đơn hàng sẽ được xử lý sau khi xác nhận thành công.
            </p>
            <Button onClick={() => router.push("/")} className="w-full bg-[#219EBC] hover:bg-[#197ba3] mb-2">
              Về trang chủ
            </Button>
            <Button onClick={() => router.push("/profile")} variant="outline" className="w-full">
              Xem đơn hàng
            </Button>
          </>
        ) : (
          <>
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Thanh toán thành công!
            </h1>
            <Button onClick={() => router.push("/")} className="w-full bg-[#219EBC] hover:bg-[#197ba3] mb-2">
              Về trang chủ
            </Button>
            <Button onClick={() => router.push("/profile")} variant="outline" className="w-full">
              Xem đơn hàng
            </Button>
          </>
        )}
      </div>
    </div>
  );
} 