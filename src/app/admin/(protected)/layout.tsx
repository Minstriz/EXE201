"use client";
import AppHeader from "@/components/admin/AppHeader";
import AppSidebar from "@/components/admin/AppSidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAdmin = localStorage.getItem("isAdmin");
      if (isAdmin !== "true") {
        router.replace("/admin/login");
      } else {
        setIsChecking(false);
      }
    }
  }, [router]);

  if (isChecking) {
    return null; // hoặc có thể trả về loading
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <AppSidebar />
      </div>
      <div className="flex flex-col">
        <AppHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 