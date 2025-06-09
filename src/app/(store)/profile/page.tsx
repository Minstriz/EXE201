"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { User as UserIcon, Mail, Phone, MapPin, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Order {
  _id: string;
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
  const { user, isAuthenticated, updateUser, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Add state for form data including address fields
  const [profileFormData, setProfileFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "", // Add address field
    city: user?.city || "",       // Add city field
    province: user?.province || "", // Add province field
  });

  // Update form data when user context changes
  useEffect(() => {
    if (user) {
      setProfileFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        province: user.province || "",
      });
    } else {
       // Clear form data if user logs out
       setProfileFormData({
          fullName: "",
          email: "",
          phone: "",
          address: "",
          city: "",
          province: "",
       });
    }
  }, [user]);

  // Function to fetch user profile data
  const fetchUserProfile = useCallback(async () => {
    if (!user?._id) {
      console.log("User ID not available, cannot fetch profile.");
      return;
    }
    try {
      const response = await fetch(`/api/admin/users/${user._id}`);
      if (!response.ok) throw new Error("Failed to fetch user profile");
      const data = await response.json();
      updateUser(data);
       setProfileFormData({
          fullName: data.fullName || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          city: data.city || "",
          province: data.province || "",
       });
    } catch (error: unknown) {
      console.error("Error fetching user profile:", error);
      toast.error("Không thể tải thông tin tài khoản");
    }
  }, [user?._id, updateUser, setProfileFormData]); 
  const fetchUserProfileRef = useRef(fetchUserProfile);
  useEffect(() => {
    fetchUserProfileRef.current = fetchUserProfile;
  }, [fetchUserProfile]);

  const fetchOrders = useCallback(async () => {
    if (!user) {
      console.log("User not available, cannot fetch orders.");
      return;
    }
    try {
      const response = await fetch(`/api/orders?userId=${user._id}`);
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrders(data);
    } catch (error: unknown) {
      console.error("Error fetching orders:", error);
      toast.error("Không thể tải lịch sử đơn hàng");
    }
  }, [user, setOrders]); // Add dependencies for useCallback

  // Initial fetch of user profile data on mount
  useEffect(() => {
    setIsClient(true);
    const tab = searchParams.get("tab");
    if (tab === "orders") {
      setActiveTab("orders");
    } else {
       // Set activeTab to 'profile' if no tab param or not 'orders'
       setActiveTab("profile");
    }
    // Initial fetch: only call fetchUserProfile if user is initially available and component is client-side
    // This useEffect should run only once on mount, or when user changes significantly (e.g., login/logout)
    // Removed fetchUserProfile from this dependency array to prevent loop triggered by updateUser
    if (user?._id && isClient) { 
       console.log("Initial user available, fetching profile once...");
       fetchUserProfileRef.current(); // Call via ref
    }
     // Removed fetchUserProfile from dependencies here.
  }, [user?._id, isAuthenticated, isClient, searchParams]); // Removed fetchUserProfile from dependencies

  useEffect(() => {
    if (isClient && !isAuthenticated) {
      router.push("/login-mock");
    }
  }, [isClient, isAuthenticated, router]);

  useEffect(() => {
    if (user && activeTab === "orders") {
      fetchOrders();
    }
  }, [user, activeTab, fetchOrders]); // Add fetchOrders to dependencies

  // Update handler to use profileFormData state
  const handleProfileInputChange = (field: keyof typeof profileFormData, value: string) => {
    setProfileFormData({
      ...profileFormData,
      [field]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);

    try {
      // Add console log to inspect data before sending
      console.log("Data being sent to updateAddress API:", profileFormData);

      // Call the centralized update API endpoint
      const response = await fetch("/api/users/updateAddress", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          fullName: profileFormData.fullName,
          email: profileFormData.email,
          phone: profileFormData.phone,
          address: profileFormData.address,
          city: profileFormData.city,
          province: profileFormData.province,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update user");
      }

      const updatedUser = await response.json();
      updateUser(updatedUser.user);
      toast.success("Thông tin tài khoản đã được cập nhật");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error((error as Error).message || "Cập nhật thông tin tài khoản thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Handler for sorting orders
  const handleSortOrderChange = (value: string) => {
    // Ensure the value is either 'newest' or 'oldest'
    if (value === 'newest' || value === 'oldest') {
      setSortOrder(value);
    }
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

  // Thêm hàm getStatusColor để đồng bộ màu sắc trạng thái
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600'; // Đang chờ xác nhận - vàng
      case 'processing':
        return 'text-purple-600'; // Đang xử lý - tím
      case 'shipping':
        return 'text-cyan-600'; // Đang giao hàng - xanh ngọc
      case 'delivered':
        return 'text-green-600'; // Đã giao - xanh lá
      case 'cancelled':
        return 'text-red-600'; // Đã hủy - đỏ
      case 'paid':
        return 'text-blue-600'; // Đã thanh toán - xanh dương
      case 'failed':
        return 'text-orange-600'; // Thanh toán thất bại - cam
      case 'refunded':
        return 'text-pink-500'; // Đã hoàn tiền - hồng
      default:
        return 'text-gray-800'; // Mặc định
    }
  };

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
                        value={profileFormData.fullName}
                        onChange={(e) => handleProfileInputChange("fullName", e.target.value)}
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
                        value={profileFormData.email}
                        onChange={(e) => handleProfileInputChange("email", e.target.value)}
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
                        value={profileFormData.phone}
                        onChange={(e) => handleProfileInputChange("phone", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Add Address Fields */}
                   <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Địa chỉ chi tiết
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Số nhà, tên đường..."
                        value={profileFormData.address}
                        onChange={(e) => handleProfileInputChange("address", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Tỉnh/Thành phố
                    </label>
                    <div className="relative">
                       {/* You might want a Select component here for a real app */}
                       <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        type="text"
                         placeholder="Ví dụ: Hồ Chí Minh"
                        value={profileFormData.province}
                        onChange={(e) => handleProfileInputChange("province", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                   <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Thành phố/Quận/Huyện
                    </label>
                    <div className="relative">
                       {/* You might want a Select component here for a real app, possibly dependent on Province selection */}
                       <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        type="text"
                         placeholder="Ví dụ: Quận 1"
                        value={profileFormData.city}
                        onChange={(e) => handleProfileInputChange("city", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                </div>

                <Button type="submit" className="bg-[#219EBC] text-white hover:bg-[#1b89a0]" disabled={isLoading}>
                  {isLoading ? "ĐANG LƯU..." : "Cập nhật thông tin"}
                </Button>
              </motion.form>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-semibold text-gray-800">Lịch sử đơn hàng</h3>

                 {/* Order Filter and Sort */}
                 <div className="flex items-center space-x-4 mb-4">
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                       <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Trạng thái đơn hàng" />
                       </SelectTrigger>
                       <SelectContent>
                          <SelectItem value="all">Tất cả trạng thái</SelectItem>
                          <SelectItem value="pending">Đang xử lý</SelectItem>
                          <SelectItem value="delivered">Đã giao</SelectItem>
                          <SelectItem value="cancelled">Đã hủy</SelectItem>
                       </SelectContent>
                    </Select>

                     <Select value={sortOrder} onValueChange={handleSortOrderChange}>
                       <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Sắp xếp" />
                       </SelectTrigger>
                       <SelectContent>
                          <SelectItem value="newest">Mới nhất</SelectItem>
                          <SelectItem value="oldest">Cũ nhất</SelectItem>
                       </SelectContent>
                    </Select>
                 </div>

                {filteredAndSortedOrders.length > 0 ? (
                  <div className="space-y-4">
                    {filteredAndSortedOrders.map((order) => (
                      <div
                        key={order._id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold">Đơn hàng #{order._id}</p>
                            <p className="text-sm text-gray-600">Ngày đặt: {new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className={`font-medium ${getStatusColor(order.status)}`}>
                            {order.status === 'pending'
                              ? 'Đang chờ xác nhận'
                              : order.status === 'processing'
                              ? 'Đang xử lý'
                              : order.status === 'shipping'
                              ? 'Đang giao hàng'
                              : order.status === 'delivered'
                              ? 'Đã giao'
                              : order.status === 'cancelled'
                              ? 'Đã hủy'
                              : order.status === 'paid'
                              ? 'Đã thanh toán'
                              : order.status === 'failed'
                              ? 'Thanh toán thất bại'
                              : order.status === 'refunded'
                              ? 'Đã hoàn tiền'
                              : order.status}
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                           <p className="text-sm text-gray-700">Tổng tiền: {order.totalAmount.toLocaleString()} VNĐ</p>
                           <ChevronRight className="text-gray-500" size={20} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">Bạn chưa có đơn hàng nào.</p>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Order Detail Dialog */}
         <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
            <DialogContent className="max-w-3xl">
               <DialogHeader>
                  <DialogTitle>Chi tiết đơn hàng #{selectedOrder?._id}</DialogTitle>
               </DialogHeader>
               {selectedOrder && (
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                           <p className="text-gray-500">Ngày đặt:</p>
                           <p className="font-medium">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                        </div>
                         <div>
                           <p className="text-gray-500">Trạng thái:</p>
                           <p className={`font-medium ${getStatusColor(selectedOrder.status)}`}>
                              {selectedOrder.status === 'pending'
                                ? 'Đang chờ xác nhận'
                                : selectedOrder.status === 'processing'
                                ? 'Đang xử lý'
                                : selectedOrder.status === 'shipping'
                                ? 'Đang giao hàng'
                                : selectedOrder.status === 'delivered'
                                ? 'Đã giao'
                                : selectedOrder.status === 'cancelled'
                                ? 'Đã hủy'
                                : selectedOrder.status === 'paid'
                                ? 'Đã thanh toán'
                                : selectedOrder.status === 'failed'
                                ? 'Thanh toán thất bại'
                                : selectedOrder.status === 'refunded'
                                ? 'Đã hoàn tiền'
                                : selectedOrder.status}
                           </p>
                        </div>
                          {/* Add paymentId if available */}
                          {selectedOrder.paymentId && (
                            <div>
                              <p className="text-gray-500">Mã thanh toán:</p>
                              <p className="font-medium">{selectedOrder.paymentId}</p>
                            </div>
                          )}
                     </div>

                     <div className="space-y-3">
                        <h4 className="font-medium text-gray-700">Sản phẩm</h4>
                         <div className="space-y-3">
                           {selectedOrder.items.map(item => (
                              <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                 <div className="relative w-16 h-16 flex-shrink-0">
                                    <Image src={item.image} alt={item.name} fill className="object-cover rounded" />
                                 </div>
                                 <div className="flex-1">
                                    <p className="font-medium text-sm">{item.name}</p>
                                    <p className="text-xs text-gray-500">Số lượng: {item.quantity}</p>
                                    <p className="text-xs font-medium">{item.price.toLocaleString()} VNĐ</p>
                                 </div>
                                 <div className="text-right text-sm font-medium">
                                    {(item.price * item.quantity).toLocaleString()} VNĐ
                                 </div>
                              </div>
                           ))}
                         </div>
                     </div>

                     <div className="flex justify-between items-center pt-4 border-t">
                        <span className="text-lg font-semibold">Tổng tiền:</span>
                        <span className="text-xl font-bold text-[#219EBC]">{selectedOrder.totalAmount.toLocaleString()} VNĐ</span>
                     </div>

                     {/* Add User Info / Shipping Address if available in Order object */}
                      {/* Example: If your Order model includes shippingAddress */}
                      {/* selectedOrder.shippingAddress && (
                         <div className="space-y-2 pt-4 border-t">
                            <h4 className="font-medium text-gray-700">Địa chỉ giao hàng</h4>
                            <p className="text-sm text-gray-600">{selectedOrder.shippingAddress.fullName}</p>
                            <p className="text-sm text-gray-600">{selectedOrder.shippingAddress.phone}</p>
                            <p className="text-sm text-gray-600">{selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.province}</p>
                         </div>
                      ) */}

                  </div>
               )}
            </DialogContent>
         </Dialog>

         {/* Logout Button */}
         {isClient && isAuthenticated && (
            <div className="max-w-4xl mx-auto mt-6 text-right">
               <Button onClick={handleLogout} className="bg-red-500 text-white hover:bg-red-600">
                  Đăng xuất
               </Button>
            </div>
         )}

      </motion.div>
    </div>
  );
} 