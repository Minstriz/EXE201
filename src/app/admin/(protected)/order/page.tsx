"use client";

import { useEffect, useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
}

interface Order {
  _id: string;
  userId: { _id: string; fullName: string };
  items: OrderItem[];
  totalAmount: number;
  status: string; // e.g., 'pending', 'delivered', 'cancelled'
  createdAt: string;
  updatedAt?: string;
  paymentId?: string;
}

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }
      const data = await res.json();
      console.log("Fetched orders data:", data);
      setOrders(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error(`Error updating status: ${res.status}`);
      }

      // Refresh the orders list after successful update
      fetchOrders();

    } catch (err) {
      console.error('Error updating order status:', err);
      alert(`Failed to update order status: ${(err as Error).message}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600'; // Đang xử lý - vàng
      case 'processing':
        return 'text-purple-600'; // Đang xử lý chi tiết - tím
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
      case 'shipping':
        return 'text-cyan-600'; // Đang giao hàng - xanh ngọc
      default:
        return 'text-gray-800'; // Mặc định
    }
  };

  // Lọc và sắp xếp đơn hàng dựa trên searchTerm, sortOrder, và filterStatus
  const filteredAndSortedOrders = useMemo(() => {
    let filteredOrders = orders;

    // Apply search term filter
    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      filteredOrders = filteredOrders.filter(order =>
        order._id.toLowerCase().includes(lowercasedSearchTerm) ||
        order.userId._id.toLowerCase().includes(lowercasedSearchTerm) ||
        order.userId.fullName.toLowerCase().includes(lowercasedSearchTerm)
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.status === filterStatus);
    }

    // Apply sort order
    return [...filteredOrders].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      if (sortOrder === 'newest') {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });
  }, [orders, searchTerm, sortOrder, filterStatus]);

  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Đơn hàng</h1>

      {/* Search, Sort, and Filter Controls */}
      <div className="flex justify-between items-center mb-4 space-x-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo Mã ĐH hoặc User ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded p-2 w-1/3"
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
          className="border rounded p-2"
        >
          <option value="newest">Sắp xếp: Mới nhất</option>
          <option value="oldest">Sắp xếp: Cũ nhất</option>
        </select>

        {/* Status Filter Dropdown */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded p-2"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="pending">Đang xử lý</option>
          <option value="delivered">Đã giao</option>
          <option value="cancelled">Đã hủy</option>
          <option value="paid">Đã thanh toán</option>
          <option value="failed">Thanh toán thất bại</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Order ID</th>
              <th className="py-2 px-4 border-b">Customer</th>
              <th className="py-2 px-4 border-b">Total Amount</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Created At</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedOrders.map((order) => (
              <tr key={order._id}>
                <td className="py-2 px-4 border-b">{order._id}</td>
                <td className="py-2 px-4 border-b">{order.userId?.fullName || order.userId?._id}</td>
                <td className="py-2 px-4 border-b">{order.totalAmount.toLocaleString()} VND</td>
                <td className={`py-2 px-4 border-b`}>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className={`border rounded p-1 ${getStatusColor(order.status)}`}
                  >
                    <option value="pending">Đang chờ xác nhận</option>
                    <option value="processing">Đang xử lý</option>
                    <option value="shipping">Đang giao hàng</option>
                    <option value="delivered">Đã giao</option>
                    <option value="cancelled">Đã hủy</option>
                    <option value="paid">Đã thanh toán</option>
                    <option value="failed">Thanh toán thất bại</option>
                    <option value="refunded">Đã hoàn tiền</option>
                  </select>
                </td>
                <td className="py-2 px-4 border-b">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Chi tiết đơn hàng #{selectedOrder?._id}
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
                    className={`font-medium ${getStatusColor(selectedOrder.status)}`}
                  >
                    {selectedOrder.status === "pending"
                      ? "Đang chờ xác nhận"
                      : selectedOrder.status === "processing"
                      ? "Đang xử lý"
                      : selectedOrder.status === "shipping"
                      ? "Đang giao hàng"
                      : selectedOrder.status === "delivered"
                      ? "Đã giao"
                      : selectedOrder.status === "cancelled"
                      ? "Đã hủy"
                      : selectedOrder.status === "paid"
                      ? "Đã thanh toán"
                      : selectedOrder.status === "failed"
                      ? "Thanh toán thất bại"
                      : selectedOrder.status === "refunded"
                      ? "Đã hoàn tiền"
                      : selectedOrder.status}
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
};

export default AdminOrdersPage;