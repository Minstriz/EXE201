"use client";
import { useState } from "react";
import { SignIn } from "./SignInForm";
import { SignUp } from "./SignUpForm";

export function AuthContainer() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div
      className={`relative w-[1100px] max-w-[1440px] min-h-[650px] bg-white rounded-[30px] shadow-lg overflow-hidden transition-all duration-500 ${
        isSignUp ? "active" : ""
      }`}
    >
      {/* Form Đăng Nhập */}
      <div
        className={`absolute top-0 left-0 w-1/2 h-full transition-all duration-500 ${
          isSignUp ? "-translate-x-full opacity-100 " : "opacity-100 z-10"
        }`}
      >
        <SignIn toggle={() => setIsSignUp(true)} />
      </div>

      {/* Form Đăng Ký */}
      <div
        className={`absolute top-0 left-0 w-1/2 h-full transition-all duration-500 ${
          isSignUp ? "translate-x-full opacity-100" : "opacity-0 z-0"
        }`}
      >
        <SignUp toggle={() => setIsSignUp(false)} />
      </div>

      {/* Animation Panel */}
      <div
        className={`absolute top-0 left-1/2 w-1/2 h-full bg-gradient-to-r border-4 border-white from-indigo-500 to-cyan-500 text-white flex flex-col items-center justify-center p-12 transition-all duration-500 ${
          isSignUp
            ? "-translate-x-full rounded-e-[200px] rounded-l-4xl"
            : "rounded-l-[200px] rounded-e-4xl"
        }`}
      >
        {isSignUp ? (
          <div className="text-center">
            <h1 className="text-2xl font-bold">Chào mừng trở lại!</h1>
            <p className="my-4">Hãy đăng nhập để tiếp tục sử dụng</p>
            <button
              onClick={() => setIsSignUp(false)}
              className="h-12 bg-white text-indigo-500 px-6 py-2 rounded-md"
            >
              Đăng nhập
            </button>
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-2xl font-bold">Xin chào!</h1>
            <p className="my-4">Đăng ký để trải nghiệm ngay</p>
            <button
              onClick={() => setIsSignUp(true)}
              className="h-12 bg-white text-indigo-500 px-6 py-2 rounded-md"
            >
              Đăng ký
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
