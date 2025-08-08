import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import ClientChatbot from "@/components/ClientChatbot";
import { Toaster } from "react-hot-toast"; // 👈 import Toaster

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "À Sài Gòn",
  description:
    "À Sài Gòn - Chuyên cung cấp các sản phẩm thủ công, handmade, thiết kế riêng tại Sài Gòn",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <ClientLayout>{children}</ClientLayout>
        <Toaster position="top-center" /> 
        <ClientChatbot />
      </body>
    </html>
  );
}
