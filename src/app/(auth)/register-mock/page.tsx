"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FaGoogle, FaFacebookF, FaInstagram, FaEye, FaEyeSlash } from "react-icons/fa";
import Footer from "@/components/Footer";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    email: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate form
    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      setIsLoading(false);
      return;
    }

    try {
      // Remove frontend check for existing username
      // The backend API /api/auth/register now handles checking for existing email/username

      // Call the new backend API route for registration
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          // Include other fields if your form collects them, e.g., address, city, province
          // address: formData.address,
          // city: formData.city,
          // province: formData.province,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific errors from backend (like duplicate email/username)
        if (response.status === 400 && data.error) {
           toast.error(data.error);
        } else {
           throw new Error(data.error || "Đăng ký thất bại");
        }
         setIsLoading(false);
         return;
      }

      toast.success("Đăng ký thành công");
      // Depending on your flow, you might want to auto-login the user or redirect to login page
      // If your backend returns user data upon successful registration and you want to auto-login:
       if (data.user) {
         login(data.user); // Use the user data returned from the backend
         router.push("/"); // Redirect to home or dashboard
       } else {
          // If backend doesn't return user data, redirect to login page
          router.push("/login-mock"); // Redirect to the login page for manual login
       }

    } catch (error) {
      // Type assertion to treat error as Error for its message property
      console.error("Registration error:", error);
      toast.error((error as Error).message || "Đã xảy ra lỗi khi đăng ký");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen justify-between bg-white">
      <main className="flex flex-col items-center pt-24">
        <div className="w-full max-w-6xl px-6 py-8">
          <div className="flex justify-between items-center gap-8">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-2">
                Nếu bạn đã có tài khoản, hãy đăng nhập{" "}
                <Link href="/login-mock" className="text-[#219EBC] underline">
                  tại đây.
                </Link>
              </p>
              <h2 className="text-[#219EBC] text-2xl font-bold mb-2">
                CHÀO MỪNG!
              </h2>
              <p className="text-black mb-4 font-semibold">
                Đăng ký tài khoản mới
              </p>

              <div className="flex gap-2 mb-4">
                <Button className="flex items-center gap-2 bg-[#6DB4C9] text-white px-4 py-2 rounded">
                  <FaGoogle /> Đăng ký bằng Google
                </Button>
                <Button className="bg-gray-400 text-white p-2 rounded-full">
                  <FaFacebookF />
                </Button>
                <Button className="bg-gray-400 text-white p-2 rounded-full">
                  <FaInstagram />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold">Tên đăng nhập</label>
                  <input
                    type="text"
                    placeholder="username"
                    className="w-full border p-3 rounded mt-1"
                    required
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">Họ và tên</label>
                  <input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    className="w-full border p-3 rounded mt-1"
                    required
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                  />
                </div>

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

                <div>
                  <label className="text-sm font-semibold">Số điện thoại</label>
                  <input
                    type="tel"
                    placeholder="0123456789"
                    className="w-full border p-3 rounded mt-1"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>

                <div className="relative">
                  <label className="text-sm font-semibold">Mật khẩu</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
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

                <div className="relative">
                  <label className="text-sm font-semibold">Xác nhận mật khẩu</label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu"
                    className="w-full border p-3 rounded mt-1 pr-10"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                  />
                  <div
                    className="absolute right-3 top-9 bg-[#219EBC] p-2 rounded cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="text-white" />
                    ) : (
                      <FaEye className="text-white" />
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#219EBC] text-white p-3 rounded hover:bg-[#1b89a0] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "ĐANG XỬ LÝ..." : "ĐĂNG KÝ"}
                </button>
              </form>
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