'use client';

import { useState } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import { useCart } from '@/app/context/CartContext';
import toast from 'react-hot-toast';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const ELEMENTS = [
  { id: 'a', label: 'Nhà thờ Đức Bà' },
  { id: 'b', label: 'Dinh Độc Lập' },
  { id: 'c', label: 'Chợ Bến Thành' },
  { id: 'd', label: 'Bưu điện Thành Phố' },
  { id: 'e', label: 'Bitexco' },
  { id: 'f', label: 'Bảo tàng Lịch Sử' },
  { id: 'g', label: 'Nhà hát Thành Phố' }
];

export default function CustomizeTotePage() {
  const { addToCart } = useCart();
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const price = 249000;
  const selectedLabel = ELEMENTS.find((e) => e.id === selectedElement)?.label || '';
  const previewImage = selectedElement
    ? `/images/tote/${ELEMENTS.findIndex((e) => e.id === selectedElement) + 1}.png`
    : '/images/tote/tuiblank.png';

  const handleAddToCart = () => {
    if (!selectedElement) {
      toast.error('Vui lòng chọn hình trang trí');
      return;
    }

    const cartItem = {
      id: `tote-${selectedElement}`,
      name: `${selectedLabel} (tote)`,
      price,
      image: previewImage,
      quantity,
      category: 'tote'
    };

    addToCart(cartItem);

    toast.custom((t) => (
      <div
        className={`flex items-center gap-3 p-4 bg-white shadow-lg rounded-lg border text-black ${
          t.visible ? 'animate-enter' : 'animate-leave'
        }`}
      >
        <CheckCircleIcon className="w-5 h-5 text-green-600" />
        <span className="text-sm font-medium">Đã thêm vào giỏ hàng</span>
      </div>
    ));
  };

  return (
    <div className="flex flex-col items-center pt-20 pb-8">
      <h1 className="text-3xl font-bold text-[#219EBC] mb-10">Tùy chỉnh sản phẩm</h1>

      <div className="flex flex-col md:flex-row gap-12">
        <div className="w-[300px] h-[300px] border rounded shadow">
          <Image
            src={previewImage}
            alt="Preview"
            width={300}
            height={300}
            className="object-contain w-full h-full"
          />
        </div>

        <div className="flex flex-col justify-between">
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

          {/* Số lượng */}
          <div className="mt-4 flex items-center gap-4">
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

          {/* Giá tiền */}
          <div className="mt-4">
            <span className="text-xl font-bold text-[#219EBC]">{price.toLocaleString()} VND</span>
          </div>

          {/* Nút thêm giỏ hàng */}
          <div className="mt-6">
            <button
              className="w-full bg-[#FB8501] text-white font-semibold px-4 py-2 rounded hover:opacity-90"
              onClick={handleAddToCart}
            >
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
