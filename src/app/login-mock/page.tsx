"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import {  FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/app/context/AuthContext";

export default function LoginMockPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Đăng nhập thất bại");
      }

      // Lưu thông tin người dùng vào localStorage và cập nhật AuthContext
      localStorage.setItem("user", JSON.stringify(data.user));
      login(data.user);  // Gọi hàm login từ AuthContext
      toast.success("Đăng nhập thành công", {
        style: {
          background: '#4ade80',
          color: 'white',
          border: 'none',
        },
        icon: '🎉',
      });
      router.push("/");
    } catch (error) {
      toast.error((error as Error).message, {
        style: {
          background: '#ef4444',
          color: 'white',
          border: 'none',
        },
        icon: '❌',
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen justify-between bg-white">
      <main className="flex flex-col items-center pt-24">
        <div className="w-full max-w-6xl px-6 py-8">
          <div className="flex justify-between items-center gap-8">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-2">
                Nếu bạn chưa có tài khoản, hãy đăng ký{" "}
                <Link href="/register-mock" className="text-[#219EBC] underline">
                  tại đây.
                </Link>
              </p>
              <h2 className="text-[#219EBC] text-2xl font-bold mb-2">
                CHÀO MỪNG!
              </h2>
              <p className="text-black mb-4 font-semibold">
                Đăng nhập vào tài khoản của bạn
              </p>


              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold">Email</label>
                  <input
                    type="email"
                    placeholder="@gmail.com"
                    className="w-full border p-3 rounded mt-1"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="relative">
                  <label className="text-sm font-semibold">Mật khẩu</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Asaigon123456"
                    className="w-full border p-3 rounded mt-1 pr-10"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  <div
                    className="absolute right-3 top-9 bg-[#219EBC] p-2 rounded cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-white" />
                    ) : (
                      <FaEye className="text-white" />
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="remember" className="w-4 h-4" />
                  <label htmlFor="remember" className="text-sm">
                    Ghi nhớ tài khoản
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#219EBC] text-white p-3 rounded hover:bg-[#1b89a0]"
                >
                  ĐĂNG NHẬP
                </button>
              </form>

              <p className="mt-4 text-sm text-gray-600">
                Quên mật khẩu?{" "}
                <span className="text-[#219EBC] cursor-pointer underline">
                  Đặt lại tại đây
                </span>
              </p>
            </div>

            <div className="relative flex justify-center items-center">
              <Image
                src="/images/codo.png"
                alt="Building"
                width={200}
                height={300}
                className="rounded-lg shadow-lg relative z-10"
              />
              <Image
                src="/images/duongpho.png"
                alt="Street"
                width={250}
                height={350}
                className="rounded-lg shadow-lg absolute top-10 left-16"
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
