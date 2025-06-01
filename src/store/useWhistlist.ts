import { Product } from "@/types/product";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  items: Product[];
  toggleFavorite: (product: Product) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      items: [],

      toggleFavorite: (product) =>
        set((state) => {
          const isFavorite = state.items.some((item) => item.id === product.id);
          return {
            items: isFavorite
              ? state.items.filter((item) => item.id !== product.id)
              : [...state.items, product],
          };
        }),
    }),
    {
      name: "favorite-storage",
    }
  )
);
