import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  inventory: number;
  inStock: boolean;
  size?: string;
  color?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
  key: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, size?: string, color?: string) => void;
  removeItem: (product: Product) => void;
  updateQuantity: (product: Product, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1, size = "M", color = "Default") => {
        const { items } = get();
        const existingItemIndex = items.findIndex(
          (item) => item.product._id === product._id && item.size === size && item.color === color
        );

        if (existingItemIndex > -1) {
          const updatedItems = [...items];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + quantity,
          };
          set({ items: updatedItems });
        } else {
          const newItem: CartItem = {
            product,
            quantity,
            size,
            color,
            key: `${product._id}-${size}-${color}-${Date.now()}`,
          };
          set({ items: [...items, newItem] });
        }
      },
      removeItem: (product) => {
        const { items } = get();
        set({
          items: items.filter(
            (item) => item.product._id !== product._id
          ),
        });
      },
      updateQuantity: (product, quantity) => {
        const { items } = get();
        set({
          items: items.map((item) =>
            item.product._id === product._id
              ? { ...item, quantity }
              : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
    }
  )
); 