"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { FaGoogle, FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa";

const AuthForm = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-200 to-blue-200">
      <div
        className={`relative w-[1100px] max-w-[1440px] min-h-[650px] bg-white rounded-[30px] shadow-lg overflow-hidden transition-all duration-100 ${
          isActive ? "active" : ""
        }`}
      >
        {/* Đăng ký */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full transition-all duration-500 ${
            isActive ? "translate-x-full opacity-100 " : "opacity-0 z-0"
          }`}
        >
          <form className="flex flex-col items-center justify-center h-full p-12">
            <h1 className="text-2xl font-bold">Tạo tài khoản</h1>
            <div className="flex space-x-3 my-5">
              <FaGoogle className="p-3 border rounded-full w-12 h-12" />
              <FaFacebookF className="p-3 border rounded-full w-12 h-12" />
              <FaGithub className="p-3 border rounded-full w-12 h-12" />
              <FaLinkedinIn className="p-3 border rounded-full w-12 h-12" />
            </div>
            <div className="grid gap-4 w-4/5">
              <div className="grid gap-2">
                <Label htmlFor="name">Họ và Tên</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  required
                  className="h-12"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className="h-12"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  className="h-12"
                />
              </div>
              <Button type="submit" className="w-full h-12">
                Đăng ký
              </Button>
            </div>
          </form>
        </div>

        {/* Đăng nhập */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full transition-all duration-500 ${
            isActive ? "-translate-x-full opacity-0 z-0" : "opacity-100 z-10"
          }`}
        >
          <form className="flex flex-col items-center justify-center h-full p-12">
            <h1 className="text-2xl font-bold">Đăng nhập</h1>
            <div className="flex space-x-3 my-5">
              <FaGoogle className="p-3 border rounded-full w-12 h-12" />
              <FaFacebookF className="p-3 border rounded-full w-12 h-12" />
              <FaGithub className="p-3 border rounded-full w-12 h-12" />
              <FaLinkedinIn className="p-3 border rounded-full w-12 h-12" />
            </div>
            <div className="grid gap-4 w-4/5">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className="h-12"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  className="h-12"
                />
                <a
                  href="#"
                  className="text-sm underline-offset-4 hover:underline"
                >
                  Quên mật khẩu?
                </a>
              </div>
              <Button type="submit" className="w-full h-12">
                Đăng nhập
              </Button>
            </div>
          </form>
        </div>

        {/* Toggle Panel */}
        <div
          className={`absolute top-0 left-1/2 w-1/2 h-full bg-gradient-to-r border-4 border-white from-indigo-500 to-cyan-500  text-white flex flex-col items-center justify-center p-12 transition-all duration-500 ${
            isActive
              ? "-translate-x-full rounded-e-[200px] rounded-l-4xl"
              : "rounded-l-[200px] rounded-e-4xl"
          }`}
        >
          {isActive ? (
            <div className="text-center">
              <h1 className="text-2xl font-bold">Chào mừng trở lại!</h1>
              <p className="my-4">Hãy đăng nhập để tiếp tục sử dụng</p>
              <Button onClick={() => setIsActive(false)} className="h-12">
                Đăng nhập
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <h1 className="text-2xl font-bold">Xin chào!</h1>
              <p className="my-4">Đăng ký để trải nghiệm ngay</p>
              <Button onClick={() => setIsActive(true)} className="h-12">
                Đăng ký
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
