import type { Metadata } from "next";
import "../globals.css";
import AppHeader from "@/components/admin/AppHeader";
import AppSidebar from "@/components/admin/AppSidebar";

export const metadata: Metadata = {
  title: "À Sài Gòn",
  description:
    "À Sài Gòn - Chuyên cung cấp các sản phẩm thủ công, handmade, thiết kế riêng tại Sài Gòn",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
