"use client";
import React from "react";
import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, removeFromCart, updateQuantity, totalAmount } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    onClose(); // Đóng sidebar
    router.push("/cart"); // Chuyển đến trang cart
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-4 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Giỏ hàng</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <p className="text-center text-gray-500 mt-4">Giỏ hàng trống</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 mb-4 pb-4 border-b">
                <div className="relative w-20 h-20">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.category}</p>
                  <p className="font-bold mt-1">
                    {item.price.toLocaleString()} VNĐ
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center border rounded"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center border rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="mt-auto pt-4 border-t">
          <div className="flex justify-between mb-4">
            <span className="font-bold">Tổng cộng:</span>
            <span className="font-bold">{totalAmount.toLocaleString()} VNĐ</span>
          </div>
          <Button
            className="w-full bg-[#219EBC] hover:bg-[#197ba3]"
            onClick={handleCheckout}
            disabled={items.length === 0}
          >
            Thanh toán
          </Button>
        </div>
      </div>
    </div>
  );
} 