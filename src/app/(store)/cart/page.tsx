"use client";
import React, { useEffect, useState } from "react";
import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  province?: string;
}

export default function CartPage() {
  const router = useRouter();
  const { items, removeFromCart, updateQuantity, totalAmount } = useCart();
  const [user, setUser] = useState<User | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    address: "",
    city: "",
    province: "",
  });

  useEffect(() => {
    // Lấy thông tin người dùng từ localStorage
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      toast.error("Vui lòng đăng nhập để tiếp tục");
      router.push("/login-mock");
      return;
    }

    const userData = JSON.parse(userStr);
    setUser(userData);
  }, [router]);

  const handlePayment = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để thanh toán");
      return;
    }

    try {
      // Bước 1: Lưu đơn hàng vào data/orders.json thông qua API backend
      const orderData = {
        userId: user._id,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          image: item.image,
          category: item.category,
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount: totalAmount,
        status: "pending", // Trạng thái ban đầu là pending
      };

      const saveOrderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });

      if (!saveOrderResponse.ok) {
        throw new Error("Lỗi khi lưu đơn hàng");
      }

      const savedOrder = await saveOrderResponse.json();
      console.log("Đơn hàng đã được lưu thành công với ID:", savedOrder._id);

      // Bước 2: Tạo thanh toán với VNPay sử dụng ID đơn hàng từ backend
      const paymentResponse = await fetch("/api/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: totalAmount,
          orderId: savedOrder._id,
        }),
      });

      if (!paymentResponse.ok) {
         // Nếu tạo thanh toán VNPay lỗi, cập nhật trạng thái đơn hàng sang payment_failed (tùy chọn)
         // await fetch(`/api/orders/${savedOrder.id}`, {
         //   method: "PUT",
         //   headers: { "Content-Type": "application/json" },
         //   body: JSON.stringify({ status: "payment_failed" })
         // });
        throw new Error("Lỗi khi tạo thanh toán VNPay");
      }

      const { paymentUrl } = await paymentResponse.json();

      // Bước 3: Chuyển hướng đến trang thanh toán VNPay
      window.location.href = paymentUrl;

    } catch (error) {
      console.error("Lỗi quy trình thanh toán:", error);
      toast.error((error as Error).message || "Có lỗi xảy ra trong quá trình thanh toán", {
        style: {
          background: '#ef4444',
          color: 'white',
          border: 'none',
        },
        icon: '❌',
      });
    }
  };

  const handleUpdateAddress = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/users/updateAddress", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?._id,
          ...addressForm,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Cập nhật địa chỉ thất bại");
      }

      // Cập nhật thông tin người dùng trong localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      setShowAddressForm(false);
      toast.success("Cập nhật địa chỉ thành công");

      // Sau khi cập nhật địa chỉ, gọi handlePayment để tiếp tục luồng thanh toán
       handlePayment();

    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  // Logic để hiển thị form cập nhật địa chỉ nếu người dùng chưa có
  useEffect(() => {
    if (user && (!user.address || !user.city || !user.province)) {
      setShowAddressForm(true);
    } else {
      setShowAddressForm(false);
    }
  }, [user]);


  return (
    <div className="pt-20 max-w-7xl mx-auto px-4">
      {/* Progress Header */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center bg-[#e0f4ff] rounded-lg px-8 py-4 gap-8">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-[#FB8501] text-white flex items-center justify-center font-bold">1</div>
            <span className="mt-2 text-sm font-semibold text-[#219EBC]">Giỏ hàng</span>
          </div>
          <div className="w-12 h-1 bg-[#219EBC] rounded"></div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-white border-2 border-[#219EBC] text-[#219EBC] flex items-center justify-center font-bold">2</div>
            <span className="mt-2 text-sm font-semibold text-[#219EBC]">Chi tiết thanh toán</span>
          </div>
          <div className="w-12 h-1 bg-[#219EBC] rounded"></div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-white border-2 border-[#219EBC] text-[#219EBC] flex items-center justify-center font-bold">3</div>
            <span className="mt-2 text-sm font-semibold text-[#219EBC]">Hoàn tất đơn hàng</span>
          </div>
        </div>
      </div>

      <h1 className="text-4xl font-extrabold text-center text-[#FB8501] mb-8 mt-10">
        CHỐT ĐƠN!
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">Giỏ hàng của bạn đang trống</p>
          <Button
            className="bg-[#219EBC] hover:bg-[#197ba3]"
            onClick={() => router.push("/products")}
          >
            Tiếp tục mua sắm
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Cart Items */}
          <div className="lg:col-span-2">
            {/* Coupon input */}
            <div className="flex items-center mb-4">
              <span className="font-bold text-lg mr-4">Giỏ hàng</span>
              <input
                type="text"
                placeholder="Mã giảm giá"
                className="border rounded px-3 py-2 text-sm w-40"
              />
              <Button className="ml-2 bg-[#219EBC] text-white">Áp dụng</Button>
            </div>
            {/* Cart Table */}
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-white rounded-lg shadow items-center"
                >
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain rounded"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-base text-[#023048] truncate">{item.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">{item.category} {item.size && <>| size {item.size}</>}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 ml-2"
                        title="Xóa sản phẩm"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-bold">{item.price.toLocaleString()} VND</span>
                      <span className="mx-2">x</span>
                      <div className="flex items-center border rounded">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-lg font-bold text-[#219EBC]"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-lg font-bold text-[#219EBC]"
                        >
                          +
                        </button>
                      </div>
                      <span className="mx-2">=</span>
                      <span className="font-bold text-[#FB8501]">{(item.price * item.quantity).toLocaleString()} VND</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-4 text-[#FB8501] font-medium">
              <span>•</span> Giỏ hàng đã được cập nhật
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <CartSummary totalAmount={totalAmount} onCheckout={handlePayment} />
          </div>
        </div>
      )}
    </div>
  );
}

// CartSummary component for right column
function CartSummary({ totalAmount, onCheckout }: { totalAmount: number; onCheckout: () => void }) {
  const [shipping, setShipping] = React.useState<number>(0);
  return (
    <div className="bg-[#e0f4ff] p-6 rounded-lg shadow sticky top-24">
      <h2 className="text-xl font-bold mb-4">Tổng tiền giỏ hàng</h2>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span>Tạm tính:</span>
          <span>{totalAmount.toLocaleString()} VND</span>
        </div>
        <div className="flex flex-col gap-2 mt-2">
          <span className="font-semibold">Tính phí vận chuyển</span>
          <div className="flex flex-col gap-1">
            <label className="flex items-center">
              <input type="radio" name="shipping" value={0} checked={shipping === 0} onChange={() => setShipping(0)} className="mr-2" />
              Vận chuyển tiết kiệm
            </label>
            <label className="flex items-center">
              <input type="radio" name="shipping" value={20000} checked={shipping === 20000} onChange={() => setShipping(20000)} className="mr-2" />
              Vận chuyển nhanh nội thành TPHCM
            </label>
            <label className="flex items-center">
              <input type="radio" name="shipping" value={30000} checked={shipping === 30000} onChange={() => setShipping(30000)} className="mr-2" />
              Phí cố định: 30.000 VND
            </label>
          </div>
        </div>
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-bold">
            <span>Tổng cộng:</span>
            <span>{(totalAmount + shipping).toLocaleString()} VND</span>
          </div>
        </div>
      </div>
      <Button className="w-full bg-[#FB8501] hover:bg-[#ffb703] text-white font-bold text-lg py-3 mt-4" onClick={onCheckout}>
        TIẾN HÀNH THANH TOÁN
      </Button>
    </div>
  );
}
