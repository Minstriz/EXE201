"use client";
import {
  Home,
  ShoppingCart,
  Users,
  Package,
  PackageOpen,
  Ticket,
} from "lucide-react";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export const SIDEBAR_DATA = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <Home />,
  },
  {
    key: "User",
    label: "User",
    path: "/admin/user",
    icon: <Users />,
  },
  {
    key: "Category",
    label: "Category",
    path: "/admin/category",
    icon: <Package />,
  },
  {
    key: "Products",
    label: "Products",
    path: "/admin/products",
    icon: <PackageOpen />,
  },
  {
    key: "Orders",
    label: "Orders",
    path: "/admin/order",
    icon: <ShoppingCart />,
  },
  {
    key: "Coupon",
    label: "Coupon",
    path: "/admin/coupon",
    icon: <Ticket />,
  },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const isActive = (path: string) => path === pathname;
  return (
    <div className="flex h-full max-h-screen flex-col gap-2 sticky top-0 bg-background">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Image
            src={"/images/logo.png"}
            alt="Logo"
            className="h-[100px] w-[100px] object-cover"
            width={100}
            height={100}
          />
        </Link>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {SIDEBAR_DATA.map((items) => (
            <Link
              key={items.key}
              href={items.path}
              className={`${
                isActive(items.path)
                  ? "text-primary bg-slate-100 dark:bg-gray-800"
                  : ""
              } flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary `}
            >
              {items.icon}
              {items.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
