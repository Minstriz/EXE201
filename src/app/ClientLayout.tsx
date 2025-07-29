"use client";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "sonner";
import NavBar from "@/components/NavBar";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isAdmin = pathname?.startsWith("/admin");

  return (
    <AuthProvider>
      <CartProvider>
        {/* ✅ Chỉ render NavBar sau khi đã mount (tránh mismatch) */}
        {isMounted && !isAdmin && <NavBar />}
        {children}
        <Toaster position="top-center" />
      </CartProvider>
    </AuthProvider>
  );
}
