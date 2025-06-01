import { Product } from "@/types/product";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem extends Product {
  quantity: number;
  selectedColor: string;
  selectedSize: string;
}

interface CartState {
  items: CartItem[];
  addItem: (
    product: Product,
    selectedSize: string,
    selectedColor: string
  ) => void;
  removeItem: (uniqueKey: string) => void;
  updateItem: (uniqueKey: string, newSize: string, newColor: string) => void;
  increaseQuantity: (uniqueKey: string) => void;
  decreaseQuantity: (uniqueKey: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (product, selectedSize, selectedColor) =>
        set((state) => {
          const uniqueKey = `${product.id}-${selectedSize}-${selectedColor}`;
          const existingItem = state.items.find(
            (item) =>
              `${item.id}-${item.selectedSize}-${item.selectedColor}` ===
              uniqueKey
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                `${item.id}-${item.selectedSize}-${item.selectedColor}` ===
                uniqueKey
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                ...product,
                selectedSize,
                selectedColor,
                quantity: 1,
              },
            ],
          };
        }),

      removeItem: (uniqueKey) =>
        set((state) => ({
          items: state.items.filter(
            (item) =>
              `${item.id}-${item.selectedSize}-${item.selectedColor}` !==
              uniqueKey
          ),
        })),

      updateItem: (uniqueKey, newSize, newColor) =>
        set((state) => ({
          items: state.items.map((item) =>
            `${item.id}-${item.selectedSize}-${item.selectedColor}` ===
            uniqueKey
              ? { ...item, selectedSize: newSize, selectedColor: newColor }
              : item
          ),
        })),

      increaseQuantity: (uniqueKey) =>
        set((state) => ({
          items: state.items.map((item) =>
            `${item.id}-${item.selectedSize}-${item.selectedColor}` ===
            uniqueKey
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        })),

      decreaseQuantity: (uniqueKey) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              `${item.id}-${item.selectedSize}-${item.selectedColor}` ===
              uniqueKey
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
            .filter((item) => item.quantity > 0),
        })),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
    }
  )
);
