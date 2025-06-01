"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaGoogle, FaFacebookF, FaLinkedinIn, FaGithub } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";

export function SignIn({}: { toggle: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      toast.error("Vui lòng nhập email và mật khẩu."); // ✅ Hiển thị lỗi bằng toast
      setLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        email,
        password,
        callbackUrl: "/",
        redirect: false,
      });

      if (result?.error) {
        toast.error("Tài khoản hoặc mật khẩu không đúng !"); // ✅ Hiển thị lỗi từ API bằng toast
      } else {
        console.log("result", result);
        toast.success("Đăng nhập thành công! 🎉");
        router.push(result?.url || "/");
      }
    } catch {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-12">
      <h1 className="text-3xl font-bold">Đăng nhập</h1>

      {/* Đăng nhập bằng mạng xã hội - Đặt ngoài form */}
      <div className="flex space-x-2 my-5">
        <Button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          variant={"outline"}
          className="p-2 border rounded-full w-10 h-10"
          type="button" // Quan trọng! Không để mặc định là submit
        >
          <FaGoogle />
        </Button>
        <Button
          variant={"outline"}
          className="p-2 border rounded-full w-10 h-10"
        >
          <FaFacebookF />
        </Button>
        <Button
          variant={"outline"}
          className="p-2 border rounded-full w-10 h-10"
        >
          <FaGithub />
        </Button>
        <Button
          variant={"outline"}
          className="p-2 border rounded-full w-10 h-10"
        >
          <FaLinkedinIn />
        </Button>
      </div>

      {/* Form đăng nhập bằng email/password */}
      <form onSubmit={handleSubmit} className="grid gap-4 w-4/5 mt-5">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input type="email" name="email" required className="h-12" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Mật khẩu</Label>
          <Input type="password" name="password" required className="h-12" />
        </div>
        <Button type="submit" className="w-full h-12" disabled={loading}>
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
      </form>
    </div>
  );
}
