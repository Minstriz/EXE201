"use client";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "sonner";
import NavBar from "@/components/NavBar";
import { usePathname } from "next/navigation";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  return (
    <AuthProvider>
      <CartProvider>
        {!isAdmin && <NavBar />}
        {children}
        <Toaster position="top-center" />
      </CartProvider>
    </AuthProvider>
  );
} 