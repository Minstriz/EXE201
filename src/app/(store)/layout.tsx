import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "À Sài Gòn",
  description:
    "À Sài Gòn - Chuyên cung cấp các sản phẩm thủ công, handmade, thiết kế riêng tại Sài Gòn",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <main className="flex flex-col min-h-screen pt-16">
        <NavBar/>
        {children}
      </main>
      <Footer />
    </div>
  );
}
