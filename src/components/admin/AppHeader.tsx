"use client";
import {
  Home,
  ShoppingCart,
  Users,
  Package,
  PackageOpen,
  Ticket,
} from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
// import { ModeToggle } from "../ui/mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";
// import { useEffect, useState } from "react";
import { CircleUser, Menu } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
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
    path: "/admin/orders",
    icon: <ShoppingCart />,
  },
];

export default function AppHeader() {
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    router.replace("/admin/login");
  };
  return (
    <header className="sticky top-0 flex h-14 items-center border-b bg-background px-4 lg:h-[60px] lg:px-6 justify-between">
      <div className="flex items-center h-full">
        <Image
          src={"/images/logo.png"}
          alt="Logo"
          className="h-[100px] w-[100px] object-cover"
          width={100}
          height={100}
        />
      </div>
      <button
        onClick={handleLogout}
        className="ml-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
      >
        Đăng xuất
      </button>
    </header>
  );
}
