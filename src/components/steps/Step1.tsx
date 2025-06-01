import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import Link from "next/link";
import { ShippingOption } from "@/types/shipping";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import Image from "next/image";

function Step1({
  setStep,
  shipping, // Nhận shipping từ CartPage
  setShipping,
  shippingOptions,
}: {
  setStep: (step: number) => void;
  shipping: number; // ✅ Nhận giá trị shipping từ CartPage
  setShipping: (cost: number) => void;
  shippingOptions: ShippingOption[];
}) {
  const {
    items,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
    updateItem,
    clearCart,
  } = useCartStore();
  const router = useRouter();

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const total = subtotal + shipping; // ✅ Lấy shipping từ CartPage

  if (items.length === 0) {
    return (
      <div className="text-center pt-20">
        <ShoppingBagIcon className="w-16 h-16 text-gray-400 mx-auto" />
        <p className="text-gray-500 mt-4">Giỏ hàng của bạn đang trống</p>
        <Button className="mt-4" asChild>
          <Link href="/products">Tiếp tục mua sắm</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="pt-4">
        <div className="flex justify-between w-2/3 ">
          <h2 className="font-black text-2xl ml-2">Giỏ hàng</h2>
          <Button onClick={clearCart} className="bg-red-500 text-white mr-5">
            Xóa toàn bộ giỏ hàng
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            {items.map((item) => {
              const uniqueKey = `${item.id}-${item.selectedSize}-${item.selectedColor}`;
              return (
                <div
                  key={uniqueKey}
                  className="flex items-center justify-between p-4 border-b"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    className="w-30 h-30 cursor-pointer rounded-2xl"
                    onClick={() => router.push(`/products/${item.slug}`)}
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>

                    {/* Chọn màu và size */}
                    <div className="flex items-center gap-2 pt-2 text-gray-600">
                      <select
                        value={item.selectedColor}
                        onChange={(e) =>
                          updateItem(
                            uniqueKey,
                            item.selectedSize,
                            e.target.value
                          )
                        }
                        className="border p-1 rounded"
                      >
                        {item.colors.map((color) => (
                          <option key={color.value} value={color.value}>
                            {color.label}
                          </option>
                        ))}
                      </select>

                      <select
                        value={item.selectedSize}
                        onChange={(e) =>
                          updateItem(
                            uniqueKey,
                            e.target.value,
                            item.selectedColor
                          )
                        }
                        className="border p-1 rounded"
                      >
                        {item.sizes.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>
                    <p className="mt-2">{item.price.toLocaleString()} VND</p>
                  </div>
                  <div className="relative flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => decreaseQuantity(uniqueKey)}
                    >
                      -
                    </Button>
                    <span className="mx-2">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => increaseQuantity(uniqueKey)}
                    >
                      +
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => removeItem(uniqueKey)}
                    className="text-red-500"
                  >
                    Xóa
                  </Button>
                </div>
              );
            })}
          </div>
          <div className="bg-blue-200 ml-20 p-6 rounded-2xl max-h-[450px] max-w-[400px]">
            <h3 className="text-2xl font-black mb-8">Tổng tiền</h3>
            <div className="flex justify-between mb-4">
              <span className="text-black">Tạm tính:</span>
              <span className="text-black text-lg font-medium">
                {subtotal.toLocaleString()} VND
              </span>
            </div>
            <h4 className="my-4 text-black">Phí vận chuyển:</h4>
            <RadioGroup
              defaultValue={shipping.toString()} // ✅ Đặt giá trị mặc định từ CartPage
              onValueChange={(value) => {
                const cost = Number(value);
                setShipping(cost); // ✅ Cập nhật shipping
              }}
              className="space-y-2 text-right my-2"
            >
              {shippingOptions.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center justify-end space-x-2"
                >
                  <Label
                    htmlFor={`shipping-${option.value}`}
                    className="text-sm"
                  >
                    {option.label}
                  </Label>
                  <RadioGroupItem
                    value={option.value.toString()}
                    id={`shipping-${option.value}`}
                    className="border border-black text-black data-[state=checked]:bg-black data-[state=checked]:border-black"
                  />
                </div>
              ))}
            </RadioGroup>
            <div className="flex justify-between my-5">
              <span className="text-black font-bold text-2xl">Tổng cộng</span>
              <span className="text-black font-extrabold text-xl">
                {total.toLocaleString()} VND
              </span>
            </div>
            <Button
              onClick={() => setStep(2)}
              className="bg-orange-500 text-white text-lg w-full p-6 mt-4"
            >
              Tiếp tục thanh toán
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
export default Step1;
