import React, { useState } from "react";
import { Button } from "../ui/button";
import { useCartStore } from "@/store/useCartStore";

function Step2({
  setStep,
  shipping,
}: {
  setStep: (step: number) => void;
  shipping: number;
}) {
  const { items } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState("cod"); // Mặc định là thanh toán khi nhận hàng
  const [isPaying, setIsPaying] = useState(false);

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const total = subtotal + shipping;

  const handlePayment = async () => {
    setIsPaying(true);
    try {
      // Giả lập API thanh toán
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert("Thanh toán thành công!");
      setStep(3); // Chuyển sang bước hoàn tất
    } catch {
      alert("Thanh toán thất bại. Vui lòng thử lại.");
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-6 p-6">
      {/* Thông tin khách hàng */}
      <div className="col-span-2 bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4">Thông tin khách hàng</h2>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Họ và tên"
            className="w-full border p-2 rounded"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
          />
          <input
            type="tel"
            placeholder="Số điện thoại"
            className="w-full border p-2 rounded"
          />
          <textarea
            placeholder="Địa chỉ giao hàng"
            className="w-full border p-2 rounded h-24"
          ></textarea>
        </form>
      </div>

      {/* Tổng quát giỏ hàng */}
      <div className="col-span-1 bg-gray-100 p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>
        <div className="space-y-2">
          {items.map((item) => {
            const uniqueKey = `${item.id}-${item.selectedSize}-${item.selectedColor}`;
            return (
              <div key={uniqueKey} className="flex flex-col border-b pb-2">
                <span className="font-medium">
                  {item.name} x{item.quantity}
                </span>
                <p className="text-xs text-gray-500">
                  Size: {item.selectedSize} | Màu: {item.selectedColor}
                </p>
                <span>{(item.price * item.quantity).toLocaleString()} VND</span>
              </div>
            );
          })}
        </div>
        <div className="border-t mt-4 pt-4">
          <div className="flex justify-between">
            <span>Tạm tính:</span>
            <span>{subtotal.toLocaleString()} VND</span>
          </div>
          <div className="flex justify-between">
            <span>Phí vận chuyển:</span>
            <span>{shipping.toLocaleString()} VND</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-2">
            <span>Tổng cộng:</span>
            <span>{total.toLocaleString()} VND</span>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="font-bold mb-2">Chọn phương thức thanh toán:</h3>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              Thanh toán khi nhận hàng
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="online"
                checked={paymentMethod === "online"}
                onChange={() => setPaymentMethod("online")}
              />
              Thanh toán online
            </label>
          </div>
        </div>
        <Button
          onClick={() =>
            paymentMethod === "cod" ? setStep(3) : handlePayment()
          }
          className="bg-orange-500 text-white w-full mt-4"
          disabled={isPaying}
        >
          {isPaying ? "Đang thanh toán..." : "Tiếp tục thanh toán"}
        </Button>
        <Button
          onClick={() => setStep(1)}
          className="bg-gray-400 text-white w-full mt-2"
        >
          Quay lại giỏ hàng
        </Button>
      </div>
    </div>
  );
}

export default Step2;
