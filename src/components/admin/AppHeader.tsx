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
// import { useRouter } from "next/navigation";
import { CircleUser, Menu } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
  {
    key: "Coupon",
    label: "Coupon",
    path: "/admin/coupon",
    icon: <Ticket />,
  },
];

export default function AppHeader() {
  const pathname = usePathname();
  const isActive = (path: string) => path === pathname;

  //   const [userInfo, setUserInfo] = useState<any>(null);
  //   const router = useRouter();
  //   useEffect(() => {
  //     // Retrieve the user_info from sessionStorage
  //     const storedUserInfo = sessionStorage.getItem("user_info");

  //     if (storedUserInfo) {
  //       // If user_info exists, parse it into an object
  //       const user = JSON.parse(storedUserInfo);
  //       setUserInfo(user);
  //     }
  //   }, []);
  const handleSignOut = async () => {
    alert("đã đăng xuất");
    //   try {
    //     sessionStorage.removeItem("user_info");
    //     localStorage.removeItem("cart");
    //     alert("Đăng xuất thành công!");
    //     router.push("../");
    //   } catch (error) {
    //     console.error("Error signing out: ", error);
    //     alert("Có lỗi xảy ra khi đăng xuất!");
    //   }
  };
  return (
    <header className="sticky top-0 flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetTitle>
            <Image
              src={"/images/logo.png"}
              alt="Logo"
              className="h-[100px] w-[100px] object-cover mx-auto"
              width={100}
              height={100}
            />
          </SheetTitle>
          <nav className="grid gap-6 text-lg font-medium px-2">
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
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1"></div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="font-normal">
            {/* {userInfo?.name} */} Quang Linh
          </DropdownMenuLabel>
          <DropdownMenuLabel className="font-normal">
            {/* {userInfo?.email } */} Linh123@gmail.com
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
