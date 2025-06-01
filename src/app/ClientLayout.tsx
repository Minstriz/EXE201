"use client";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "sonner";
import NavBar from "@/components/NavBar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <NavBar />
        {children}
        <Toaster position="top-center" />
      </CartProvider>
    </AuthProvider>
  );
} 