"use client";
import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/app/context/CartContext";
import { CartSidebar } from "./CartSidebar";
import { Menu, ShoppingCart, UserCircle, Search } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { totalItems } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);


  const { user, isAuthenticated, logout, isLoading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Đăng xuất thành công");
    setIsUserMenuOpen(false);
  };

  const navBarData = [
    { title: "Trang chủ", link: "/" },
    { title: "Giới thiệu", link: "/about" },
    { title: "Khám phá", link: "/explore" },
    { title: "Sản phẩm", link: "/products" },
    { title: "Liên hệ", link: "/contact" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="h-8 w-auto"
                />
              </Link>
              <div className="hidden md:flex items-center space-x-8 ml-10">
                {navBarData.map((item) => (
                  <Link
                    key={item.title}
                    href={item.link}
                    className={`text-sm font-medium ${
                      pathname === item.link
                        ? "text-[#219EBC]"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Search className="h-5 w-5 text-gray-500" />
              </button>
              <button 
                onClick={() => setIsCartOpen(true)} 
                className="p-2 hover:bg-gray-100 rounded-full relative"
              >
                <ShoppingCart className="h-5 w-5 text-gray-500" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
              {isLoading ? (
                <div className="w-20 h-8 bg-gray-200 rounded"></div>
              ) : isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-full"
                  >
                    <UserCircle className="h-6 w-6 text-gray-500" />
                    <div>{user?.fullName}</div>
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Tài khoản của tôi
                      </Link>
                      <Link
                        href="/profile?tab=orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Lịch sử mua hàng
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/login-mock"
                    className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-gray-900 border rounded"
                  >
                    Đăng nhập
                  </Link>
                </div>
              )}
            </div>

            <div className="md:hidden flex items-center space-x-4">
              <button 
                onClick={() => setIsCartOpen(true)} 
                className="p-2 hover:bg-gray-100 rounded-full relative"
              >
                <ShoppingCart className="h-5 w-5 text-gray-500" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
              {isLoading ? (
                <div className="w-16 h-8 bg-gray-200 rounded"></div>
              ) : isAuthenticated ? (
                <Link
                  href="/profile"
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <UserCircle className="h-6 w-6 text-gray-500" />
                </Link>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/login-mock"
                    className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-gray-900 border rounded"
                  >
                    Đăng nhập
                  </Link>
                </div>
              )}

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                {isOpen ? (
                  <XMarkIcon className="h-6 w-6 text-gray-500" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-500" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

export default NavBar;
