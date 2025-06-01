import React from "react";
import { Button } from "../ui/button";
import { useCartStore } from "@/store/useCartStore";
import Link from "next/link";

function Step3({ shipping }: { shipping: number }) {
  const { items } = useCartStore();

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const total = subtotal + shipping;

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-lg w-full">
        <h2 className="text-2xl font-bold text-green-600 mb-4">
          ĐẶT HÀNG THÀNH CÔNG !
        </h2>
        <p className="text-gray-600 mb-4">
          Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ sớm xác nhận và giao hàng đến
          bạn.
        </p>

        {/* Thông tin đơn hàng */}
        <div className="border-t pt-4 text-left">
          <h3 className="text-lg font-semibold mb-2">Tóm tắt đơn hàng</h3>
          <div className="space-y-2">
            {items.map((item) => {
              const uniqueKey = `${item.id}-${item.selectedSize}-${item.selectedColor}`;
              return (
                <div key={uniqueKey} className="flex justify-between">
                  <span className="font-medium">
                    {item.name} x{item.quantity}
                  </span>
                  <span>
                    {(item.price * item.quantity).toLocaleString()} VND
                  </span>
                </div>
              );
            })}
          </div>
          <div className="border-t mt-4 pt-4 text-lg font-bold">
            <div className="flex justify-between">
              <span>Tổng cộng:</span>
              <span>{total.toLocaleString()} VND</span>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-2 flex flex-col">
          <Link href={"/"}>
            <Button className="bg-blue-500 text-white w-full">
              Quay lại trang chủ
            </Button>
          </Link>

          <Button
            onClick={() => alert("Xem đơn hàng chi tiết!")}
            className="bg-gray-400 text-white w-full"
          >
            Xem đơn hàng
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Step3;
