"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

interface Order {
  _id: string;
  name: string;
  phone: string;
  email: string;
  note: string;
  patternImage: string;
  shirtImage: string;
  createdAt: string;
  status: string;
}

export default function CustomizeShirtOrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [q, setQ] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState("");

  const statusOptions = [
    'Đã đặt',
    'Đã xác nhận',
    'Đang giao hàng',
    'Bị huỷ',
    'Đã giao hàng',
  ];

  const fetchOrders = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      q,
      status,
      ...(from ? { from } : {}),
      ...(to ? { to } : {}),
    });
    const res = await fetch(`/api/shirt-customize-order?${params}`);
    const data = await res.json();
    setOrders(data.orders || []);
    setTotal(data.total || 0);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, q, from, to, status]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Xác nhận xoá đơn này?")) return;
    const res = await fetch(`/api/shirt-customize-order?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchOrders();
    } else {
      alert("Xoá thất bại!");
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl md:w-full mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-start">Quản lý đơn áo custom</h1>
      <div className="flex flex-wrap gap-2 mb-4 items-start justify-start">
        <input
          type="text"
          placeholder="Tìm kiếm tên, email, SĐT..."
          className="border rounded px-3 py-2 flex-1 min-w-[180px]"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
        <input
          type="date"
          className="border rounded px-3 py-2 flex-1 min-w-[120px]"
          value={from}
          onChange={e => setFrom(e.target.value)}
        />
        <input
          type="date"
          className="border rounded px-3 py-2 flex-1 min-w-[120px]"
          value={to}
          onChange={e => setTo(e.target.value)}
        />
        <select
          className="border rounded px-3 py-2 flex-1 min-w-[120px]"
          value={status}
          onChange={e => { setStatus(e.target.value); setPage(1); }}
        >
          <option value="">Tất cả trạng thái</option>
          {statusOptions.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded min-w-[80px]"
          onClick={() => { setPage(1); fetchOrders(); }}
        >Lọc</button>
        <button
          className="bg-gray-300 px-4 py-2 rounded min-w-[80px]"
          onClick={() => { setQ(""); setFrom(""); setTo(""); setStatus(""); setPage(1); fetchOrders(); }}
        >Xoá lọc</button>
      </div>
      <div className="overflow-x-auto rounded shadow border bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-2">Khách hàng</th>
              <th className="border px-2 py-2">SĐT</th>
              <th className="border px-2 py-2">Email</th>
              <th className="border px-2 py-2">Trạng thái</th>
              <th className="border px-2 py-2">Ngày đặt</th>
              <th className="border px-2 py-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-4">Đang tải...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-4">Không có đơn nào</td></tr>
            ) : orders.map(order => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="border px-2 py-2">{order.name}</td>
                <td className="border px-2 py-2">{order.phone}</td>
                <td className="border px-2 py-2">{order.email}</td>
                <td className="border px-2 py-2">{order.status}</td>
                <td className="border px-2 py-2">{new Date(order.createdAt).toLocaleString()}</td>
                <td className="border px-2 py-2 flex gap-2 justify-center">
                  <button
                    className="bg-indigo-600 text-white px-2 py-1 rounded"
                    onClick={() => setSelectedOrder(order)}
                  >Xem</button>
                  <button
                    className="bg-red-600 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(order._id)}
                  >Xoá</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex flex-wrap gap-2 mt-4 items-center justify-center">
        <button
          className="px-3 py-1 border rounded"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >Trước</button>
        <span>Trang {page} / {Math.ceil(total / limit) || 1}</span>
        <button
          className="px-3 py-1 border rounded"
          disabled={page >= Math.ceil(total / limit)}
          onClick={() => setPage(page + 1)}
        >Sau</button>
        <select
          className="border rounded px-2 py-1 ml-2"
          value={limit}
          onChange={e => { setLimit(Number(e.target.value)); setPage(1); }}
        >
          {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}/trang</option>)}
        </select>
      </div>
      {/* Overlay chi tiết đơn */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-2">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8 w-full max-w-4xl relative flex flex-col md:flex-row gap-6">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
              onClick={() => setSelectedOrder(null)}
            >
              &times;
            </button>
            {/* Left: Info */}
            <div className="flex-1 min-w-[220px] flex flex-col gap-2 justify-center">
              <div className="text-lg font-bold mb-2">Chi tiết đơn áo custom</div>
              <div><b>Khách hàng:</b> {selectedOrder.name}</div>
              <div><b>SĐT:</b> {selectedOrder.phone}</div>
              <div><b>Email:</b> {selectedOrder.email}</div>
              <div><b>Trạng thái:</b> {selectedOrder.status}</div>
              <div><b>Ngày đặt:</b> {new Date(selectedOrder.createdAt).toLocaleString()}</div>
              <div><b>Ghi chú:</b> {selectedOrder.note || <i>Không có</i>}</div>
            </div>
            {/* Right: Images */}
            <div className="flex-1 min-w-[220px] flex flex-col gap-4 items-center justify-center">
              <div className="w-full">
                <div className="mb-1 font-medium">Ảnh hoạ tiết:</div>
                <Image
                  src={selectedOrder.patternImage}
                  alt="pattern"
                  width={400}
                  height={200}
                  className="w-full max-h-48 object-contain border mb-1"
                />
                <a
                  href={selectedOrder.patternImage}
                  download
                  className="inline-block mt-1 mb-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition w-full text-center"
                >
                  Tải ảnh hoạ tiết
                </a>
              </div>
              <div className="w-full">
                <div className="mb-1 font-medium">Ảnh áo + hoạ tiết:</div>
                <Image
                  src={selectedOrder.shirtImage}
                  alt="shirt"
                  width={400}
                  height={200}
                  className="w-full max-h-48 object-contain border"
                />
                <a
                  href={selectedOrder.shirtImage}
                  download
                  className="inline-block mt-1 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition w-full text-center"
                >
                  Tải ảnh áo + hoạ tiết
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
