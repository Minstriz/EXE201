"use client"
import React, { useEffect, useState } from "react";

import Image from "next/image";
interface User {
  _id: string;
  username: string;
  email: string;
  createdAt?: string;
}

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
  status: string;
  createdAt: string;
}

/* interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
} */

function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  // const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [userRes, orderRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/orders"),
      ]);
      const users = await userRes.json();
      const orders = await orderRes.json();
      setUsers(users);
      setOrders(orders);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Tổng số user
  const totalUsers = users.length;
  // Tổng số đơn hàng
  const totalOrders = orders.length;

  // Đếm đơn hàng theo tháng/năm
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const ordersThisMonthArr = orders.filter(o => {
    const d = new Date(o.createdAt);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  const ordersThisMonth = ordersThisMonthArr.length;
  const ordersThisYear = orders.filter(o => {
    const d = new Date(o.createdAt);
    return d.getFullYear() === currentYear;
  }).length;

  // Doanh thu tháng này
 const revenueThisMonth = ordersThisMonthArr
  .filter(o => o.status === "paid")
  .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

 // Doanh thu 3 tháng gần nhất
 const getMonthRevenue = (monthOffset: number) => {
   const now = new Date();
   const target = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
   const month = target.getMonth();
   const year = target.getFullYear();
   return orders
     .filter(o => {
       const d = new Date(o.createdAt);
       return d.getMonth() === month && d.getFullYear() === year && o.status === "paid";
     })
     .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
 };

 const last3MonthsRevenue = [0, 1, 2].map(offset => getMonthRevenue(offset));
 const last3MonthsLabels = [0, 1, 2].map(offset => {
   const now = new Date();
   const target = new Date(now.getFullYear(), now.getMonth() - offset, 1);
   return `${target.getMonth() + 1}/${target.getFullYear()}`;
 });

  // Thống kê sản phẩm bán chạy nhất
  const productSales: Record<string, { name: string; image: string; quantity: number }> = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      if (!productSales[item.id]) {
        productSales[item.id] = { name: item.name, image: item.image, quantity: 0 };
      }
      productSales[item.id].quantity += item.quantity;
    });
  });
  const bestSeller = Object.values(productSales).sort((a, b) => b.quantity - a.quantity)[0];
  //lấy thông tin users
  const userStatsByMonth: number[] = Array(12).fill(0);
  users.forEach(user => {
    if (user.createdAt) {
      const d = new Date(user.createdAt);
      if (d.getFullYear() === currentYear) {
        userStatsByMonth[d.getMonth()]++;
      }
    }
  });
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Thống kê tổng quan</h1>
      {loading ? (
        <div>Đang tải dữ liệu...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-10">
          <div className="bg-white rounded shadow p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">{totalUsers}</div>
            <div className="mt-2 text-gray-600">Tổng số người dùng</div>
          </div>
          <div className="bg-white rounded shadow p-6 text-center">
            <div className="text-2xl font-bold text-green-600">{totalOrders}</div>
            <div className="mt-2 text-gray-600">Tổng số đơn hàng</div>
          </div>
          <div className="bg-white rounded shadow p-6 text-center">
            <div className="text-2xl font-bold text-orange-600">{ordersThisMonth}</div>
            <div className="mt-2 text-gray-600">Đơn hàng tháng này</div>
          </div>
          <div className="bg-white rounded shadow p-6 text-center">
            <div className="text-2xl font-bold text-purple-600">{ordersThisYear}</div>
            <div className="mt-2 text-gray-600">Đơn hàng năm nay</div>
          </div>
          <div className="bg-white rounded shadow p-6 text-center">
            <div className="text-2xl font-bold text-red-600">{revenueThisMonth.toLocaleString()} VND</div>
            <div className="mt-2 text-gray-600">Doanh thu tháng này</div>
          </div>
        </div>
      )}
      {/* Doanh thu 3 tháng gần nhất */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 mt-4">
        {last3MonthsRevenue.map((revenue, idx) => (
          <div key={idx} className="bg-white rounded shadow p-6 text-center">
            <div className="text-xl font-bold text-amber-600">{revenue.toLocaleString()} VND</div>
            <div className="mt-2 text-gray-600">Doanh thu {last3MonthsLabels[idx]}</div>
          </div>
        ))}
      </div>
      {/* Sản phẩm bán chạy nhất */}
      {!loading && bestSeller && (
        <div className="bg-white rounded shadow p-6 flex items-center gap-6 max-w-xl">
          <div className="relative w-24 h-24">
            <Image
              src={bestSeller.image}
              alt={bestSeller.name}
              fill
              className="object-contain rounded"
            />
          </div>


          <div>
            <div className="text-lg font-bold">Sản phẩm bán chạy nhất</div>
            <div className="text-xl text-blue-700 font-bold mt-1">{bestSeller.name}</div>
            <div className="text-gray-600 mt-1">Đã bán: <span className="font-bold">{bestSeller.quantity}</span> sản phẩm</div>
          </div>
        </div>
      )}
      {/* Chart đơn hàng theo tháng */}
      <div className="flex gap-10 justify-center  items-start mt-20">
        {!loading && (
          <div className="">
            <h2 className="text-lg font-bold mb-6">Biểu đồ số đơn hàng theo tháng (năm {currentYear})</h2>
            {(() => {
              const orderCounts = [...Array(12)].map((_, i) =>
                orders.filter(o => {
                  const d = new Date(o.createdAt);
                  return d.getMonth() === i && d.getFullYear() === currentYear;
                }).length
              );

              const maxCount = Math.max(...orderCounts, 1); // tránh chia 0
              const maxHeight = 120; // px

              return (
                <div className="flex gap-2 items-end h-[160px] pt-8">
                  {orderCounts.map((count, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="text-sm mb-1 text-gray-700">{count}</div>
                      <div
                        className="bg-blue-500 w-6 rounded"
                        style={{
                          height: `${(count / maxCount) * maxHeight}px`,
                        }}
                      ></div>
                      <div className="text-xs mt-1">{i + 1}</div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}
        {!loading && (
          <div className="flex-col">
            <h2 className="text-lg font-bold mb-6">Số người dùng đăng ký theo tháng (năm {currentYear})</h2>
            {/* Biểu đồ số người dùng đăng ký theo tháng */}
            <div className="mt-16 pt-2">
              <div className="flex gap-2 items-end h-32">
                {userStatsByMonth.map((count, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="flex flex-col items-center">
                      <div className="text-sm mb-1 text-gray-700">{count}</div>
                      <div className="bg-green-500 w-6 rounded" style={{ height: `${count * 2}px` }}></div>
                      <div className="text-xs mt-1">{i + 1}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
