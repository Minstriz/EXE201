"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { User as UserIcon, Mail, Phone, MapPin, Package, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import Image from "next/image";
import type { User } from "@/app/context/AuthContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Order {
  id: number;
  userId: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt?: string;
  paymentId?: string;
  items: {
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
    quantity: number;
  }[];
}

export default function ProfilePage() {
  const { user, isAuthenticated, login, updateUser, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    setIsClient(true);
    const tab = searchParams.get("tab");
    if (tab === "orders") {
      setActiveTab("orders");
    }
  }, [searchParams]);

  useEffect(() => {
    if (isClient && !isAuthenticated) {
      router.push("/login-mock");
    }
  }, [isClient, isAuthenticated, router]);

  useEffect(() => {
    if (user && activeTab === "orders") {
      fetchOrders();
    }
  }, [user, activeTab]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/orders?userId=${user?.id}`);
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      toast.error("Không thể tải lịch sử đơn hàng");
    }
  };

  const handleInputChange = (field: keyof User, value: string) => {
    if (!user) return;
    // Create a temporary updated user object for input state
    updateUser({
      ...user,
      [field]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);

    try {
      // Call the centralized update API endpoint
      const response = await fetch("/api/users/updateAddress", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id, // Send the user ID
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          address: user.address, // Include address, city, province
          city: user.city,
          province: user.province,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update user");
      }

      const updatedUser = await response.json();
      updateUser(updatedUser.user); // Update context state with the user object from the response
      toast.success("Thông tin tài khoản đã được cập nhật");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Cập nhật thông tin tài khoản thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const filteredAndSortedOrders = useMemo(() => {
    let filteredOrders = orders;

    if (filterStatus !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.status === filterStatus);
    }

    return [...filteredOrders].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      if (sortOrder === "newest") {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });
  }, [orders, sortOrder, filterStatus]);

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#219EBC] to-[#197ba3] px-6 py-8">
            <div className="flex items-center space-x-4">
              <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-bold">
                {user?.fullName?.charAt(0) || user?.username?.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{user?.fullName}</h2>
                <p className="text-white/80">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b">
            <div className="flex">
              <button
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === "profile"
                    ? "text-[#219EBC] border-b-2 border-[#219EBC]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("profile")}
              >
                Thông tin tài khoản
              </button>
              <button
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === "orders"
                    ? "text-[#219EBC] border-b-2 border-[#219EBC]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("orders")}
              >
                Lịch sử mua hàng
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {activeTab === "profile" ? (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Họ và tên
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        type="text"
                        value={user?.fullName || ""}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        type="email"
                        value={user?.email || ""}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Số điện thoại
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        type="tel"
                        value={user?.phone || ""}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Địa chỉ
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        type="text"
                        value={user?.address || ""}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Thành phố
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        type="text"
                        value={user?.city || ""}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Tỉnh/Thành phố
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        type="text"
                        value={user?.province || ""}
                        onChange={(e) => handleInputChange("province", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleLogout}
                    className="hover:bg-red-50 hover:text-red-600"
                  >
                    Đăng xuất
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-[#219EBC] hover:bg-[#197ba3]"
                  >
                    {isLoading ? "Đang cập nhật..." : "Cập nhật thông tin"}
                  </Button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Lịch sử mua hàng</h2>
                  <div className="flex items-center space-x-4">
                    <Select
                      value={sortOrder}
                      onValueChange={(value: "newest" | "oldest") => setSortOrder(value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sắp xếp theo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Mới nhất</SelectItem>
                        <SelectItem value="oldest">Cũ nhất</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={filterStatus}
                      onValueChange={(value: string) => setFilterStatus(value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Lọc theo trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả trạng thái</SelectItem>
                        <SelectItem value="pending">Đang xử lý</SelectItem>
                        <SelectItem value="delivered">Đã giao</SelectItem>
                        <SelectItem value="cancelled">Đã hủy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {filteredAndSortedOrders.length === 0 ? (
                  <p className="text-gray-500">Chưa có đơn hàng nào</p>
                ) : (
                  <div className="space-y-4">
                    {filteredAndSortedOrders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="font-medium">Mã đơn hàng: #{order.id}</p>
                            <p className="text-sm text-gray-500">
                              Ngày đặt: {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-500">
                              {order.items.length} sản phẩm
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span
                              className={`px-2 py-1 rounded text-sm ${
                                order.status === "delivered"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {order.status === "delivered"
                                ? "Đã giao"
                                : order.status === "pending"
                                ? "Đang xử lý"
                                : "Đã hủy"}
                            </span>
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                            >
                              Chi tiết
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t">
                          <span className="font-medium">Tổng tiền:</span>
                          <span className="font-bold">
                            {order.totalAmount.toLocaleString()} VNĐ
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Chi tiết đơn hàng #{selectedOrder?.id}
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Ngày đặt:</p>
                  <p className="font-medium">
                    {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Trạng thái:</p>
                  <p
                    className={`font-medium ${
                      selectedOrder.status === "delivered"
                        ? "text-green-600"
                        : selectedOrder.status === "pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {selectedOrder.status === "delivered"
                      ? "Đã giao"
                      : selectedOrder.status === "pending"
                      ? "Đang xử lý"
                      : "Đã hủy"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Sản phẩm</h3>
                <div className="space-y-4">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="relative w-20 h-20">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          Số lượng: {item.quantity}
                        </p>
                        <p className="text-sm font-medium">
                          {item.price.toLocaleString()} VNĐ
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {(item.price * item.quantity).toLocaleString()} VNĐ
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-lg font-medium">Tổng tiền:</span>
                <span className="text-xl font-bold">
                  {selectedOrder.totalAmount.toLocaleString()} VNĐ
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 