"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { FaGoogle, FaFacebookF, FaLinkedinIn, FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";

export function SignUp({ toggle }: { toggle: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Đăng ký thành công! 🎉");
      toggle();
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center p-12">
      <h1 className="text-2xl font-bold">Tạo tài khoản</h1>

      {/* Đăng ký bằng mạng xã hội */}
      <div className="flex space-x-2 my-4">
        <Button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          variant={"outline"}
          className="p-2 border rounded-full w-10 h-10"
          type="button"
        >
          <FaGoogle />
        </Button>
        <Button
          variant={"outline"}
          className="p-2 border rounded-full w-10 h-10"
          type="button"
        >
          <FaFacebookF />
        </Button>
        <Button
          variant={"outline"}
          className="p-2 border rounded-full w-10 h-10"
          type="button"
        >
          <FaGithub />
        </Button>
        <Button
          variant={"outline"}
          className="p-2 border rounded-full w-10 h-10"
          type="button"
        >
          <FaLinkedinIn />
        </Button>
      </div>

      {/* Form đăng ký bằng email/password */}
      <form onSubmit={handleSubmit} className="grid gap-4 w-4/5 mt-5">
        <div className="grid gap-2">
          <Label htmlFor="name">Họ và Tên</Label>
          <Input
            type="text"
            name="name"
            required
            className="h-12"
            placeholder="Nguyễn Văn A"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            name="email"
            required
            className="h-12"
            placeholder="nguyenvana@gmail.com"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Mật khẩu</Label>
          <Input type="password" name="password" required className="h-12" />
        </div>
        <Button type="submit" className="w-full h-12" disabled={loading}>
          {loading ? "Đang đăng ký..." : "Đăng ký"}
        </Button>
      </form>

      <p className="mt-4">
        Đã có tài khoản?{" "}
        <span className="text-blue-500 cursor-pointer" onClick={toggle}>
          Đăng nhập
        </span>
      </p>
    </div>
  );
}
