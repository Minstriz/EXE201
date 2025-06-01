"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentFailedPage() {
  const router = useRouter();

  useEffect(() => {
    // Tự động chuyển hướng sau 5 giây
    const timeout = setTimeout(() => {
      router.push("/cart");
    }, 5000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto text-center"
      >
        <div className="bg-white shadow-xl rounded-2xl p-8">
          <div className="flex justify-center mb-6">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Thanh toán thất bại
          </h1>
          <p className="text-gray-600 mb-8">
            Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại sau.
          </p>
          <div className="space-y-4">
            <Button
              onClick={() => router.push("/cart")}
              className="w-full bg-[#219EBC] hover:bg-[#197ba3]"
            >
              Quay lại giỏ hàng
            </Button>
            <Button
              onClick={() => router.push("/products")}
              variant="outline"
              className="w-full"
            >
              Tiếp tục mua sắm
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 