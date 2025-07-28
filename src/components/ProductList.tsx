'use client';

import { useState } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import { useCart } from '@/app/context/CartContext';
import toast from 'react-hot-toast'; // 👈 import toast
import { CheckCircleIcon } from '@heroicons/react/24/solid'; // Nếu chưa có thư viện này, chạy: npm install @heroicons/react


const COLORS = [
  { label: 'Trắng', value: 'white', hex: '#ffffff' },
  { label: 'Đen', value: 'black', hex: '#000000' }
];

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

const ELEMENTS = [
  { id: 'a', label: 'Nhà thờ Đức Bà' },
  { id: 'b', label: 'Dinh Độc Lập' },
  { id: 'c', label: 'Chợ Bến Thành' },
  { id: 'd', label: 'Bưu điện TP' },
  { id: 'e', label: 'Bitexco' },
  { id: 'f', label: 'Bảo tàng LS' },
  { id: 'g', label: 'Nhà hát TP' }
];

export default function CustomizeShirtPage() {
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState('white');
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedElement, setSelectedElement] = useState('a');
  const [quantity, setQuantity] = useState(1);

  const price = 249000;
  const selectedElementLabel = ELEMENTS.find((e) => e.id === selectedElement)?.label || '';
  const shirtPreview = `/images/customize/${selectedElement}_${selectedColor}.png`;

  const handleAddToCart = () => {
  const cartItem = {
    id: `${selectedElement}-${selectedColor}-${selectedSize}`,
    name: selectedElementLabel,
    price,
    image: shirtPreview,
    quantity,
    category: 'shirt',
    size: selectedSize
  };

  addToCart(cartItem);

  // ✅ Thêm UI giống ảnh bạn gửi
  toast.custom((t) => (
    <div
      className={`flex items-center gap-3 p-4 bg-white shadow-lg rounded-lg border text-black ${
        t.visible ? 'animate-enter' : 'animate-leave'
      }`}
    >
      <CheckCircleIcon className="w-5 h-5 text-black" />
      <span className="text-sm font-medium">Đã thêm vào giỏ hàng</span>
    </div>
  ));
};


  return (
    <div className="flex flex-col items-center py-8">
      <h1 className="text-3xl font-bold text-[#219EBC] mb-6">Tùy chỉnh sản phẩm</h1>
      <div className="flex flex-col md:flex-row gap-12">
        {/* Preview Image */}
        <div className="w-[300px] h-[300px] border rounded shadow">
          <Image
            src={shirtPreview}
            alt="Preview"
            width={300}
            height={300}
            className="object-contain w-full h-full"
          />
        </div>

        {/* Options */}
        <div>
          {/* Màu sắc */}
          <div className="mb-4">
            <h2 className="font-semibold mb-2">Màu sắc</h2>
            <div className="flex gap-4">
              {COLORS.map((color) => (
                <div
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  className={classNames(
                    'w-8 h-8 rounded-full border-2 cursor-pointer',
                    {
                      'ring-4 ring-[#FB8501]': selectedColor === color.value
                    }
                  )}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          </div>

          {/* Kích thước */}
          <div className="mb-4">
            <h2 className="font-semibold mb-2">Kích thước</h2>
            <div className="flex gap-2">
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={classNames(
                    'px-3 py-1 border rounded hover:bg-[#219EBC] hover:text-white',
                    {
                      'bg-[#219EBC] text-white': selectedSize === size
                    }
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Trang trí */}
          <div className="mb-4">
            <h2 className="font-semibold mb-2">Trang trí</h2>
            <div className="grid grid-cols-4 gap-3">
              {ELEMENTS.map((e) => (
                <div
                  key={e.id}
                  className={classNames(
                    'flex flex-col items-center cursor-pointer',
                    {
                      'ring-2 ring-[#FB8501] rounded': selectedElement === e.id
                    }
                  )}
                  onClick={() => setSelectedElement(e.id)}
                >
                  <Image
                    src={`/images/7_elements/${e.id}.png`}
                    alt={e.label}
                    width={60}
                    height={60}
                  />
                  <span className="text-xs text-center mt-1">{e.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Số lượng & Giá & Nút */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-md font-medium">Số lượng:</span>
              <select
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="border rounded px-3 py-1"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-6">
              <span className="text-xl font-bold text-[#219EBC]">{price.toLocaleString()} VND</span>
              <button
                className="bg-[#FB8501] text-white font-semibold px-4 py-2 rounded hover:opacity-90"
                onClick={handleAddToCart}
              >
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
