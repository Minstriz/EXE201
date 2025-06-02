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
      <h1 className="text-4xl font-extrabold text-center text-orange-400 mb-8 mt-10">
        Giỏ hàng của bạn
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
          <div className="lg:col-span-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 mb-6 p-4 bg-white rounded-lg shadow"
              >
                <div className="relative w-32 h-32">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.category}</p>
                  <p className="font-bold mt-2">
                    {item.price.toLocaleString()} VNĐ
                  </p>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow sticky top-24">
              <h2 className="text-xl font-bold mb-4">Tổng đơn hàng</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span>{totalAmount.toLocaleString()} VNĐ</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển:</span>
                  <span>Miễn phí</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Tổng cộng:</span>
                    <span> {totalAmount.toLocaleString()} VNĐ</span>
                  </div>
                </div>
              </div>
              
              {showAddressForm ? (
                <form onSubmit={handleUpdateAddress} className="space-y-4">
                   <p className="text-red-500 text-sm mb-4">Vui lòng cập nhật địa chỉ để tiếp tục thanh toán.</p>
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Địa chỉ
                    </label>
                    <input
                      type="text"
                      id="address"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-base md:text-lg"
                      value={addressForm.address}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, address: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      Thành phố
                    </label>
                    <input
                      type="text"
                      id="city"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-base md:text-lg"
                      value={addressForm.city}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, city: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor="province" className="block text-sm font-medium text-gray-700">
                      Tỉnh/Thành phố
                    </label>
                    <input
                      type="text"
                      id="province"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-base md:text-lg"
                      value={addressForm.province}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, province: e.target.value })
                      }
                    />
                  </div>
                  <Button
                     type="submit"
                     className="w-full bg-[#219EBC] hover:bg-[#197ba3] text-white font-bold py-2 px-4 rounded"
                   >
                     Cập nhật địa chỉ
                   </Button>
                </form>
              ) : (
                 <Button
                   onClick={handlePayment}
                   className="w-full bg-[#219EBC] hover:bg-[#197ba3] text-white font-bold py-2 px-4 rounded"
                 >
                   Thanh toán qua VNPay
                 </Button>
              )}

            </div>
          </div>
      </div>
      )}
    </div>
  );
}
