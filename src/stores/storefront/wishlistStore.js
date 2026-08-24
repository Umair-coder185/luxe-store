import { create } from "zustand";
import { persist } from "zustand/middleware";

const normalizePrice = (val) => {
  const num = Number(val);
  if (!Number.isFinite(num)) return 0;
  return Math.max(0, num);
};

const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      _hasHydrated: false,

      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },

      toggleItem: (item) => {
        if (!item.productId || !item.slug || !item.name) return;
        const price = normalizePrice(item.price);

        set((state) => {
          const exists = state.items.some((i) => i.productId === item.productId);
          
          if (exists) {
            return {
              items: state.items.filter((i) => i.productId !== item.productId),
            };
          } else {
            const newItem = {
              productId: String(item.productId),
              slug: String(item.slug),
              name: String(item.name),
              price: price,
              image: item.image?.url ? { url: String(item.image.url) } : null,
            };
            return { items: [...state.items, newItem] };
          }
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      clearWishlist: () => {
        set({ items: [] });
      },
    }),
    {
      name: "luxe-wishlist",
      version: 1,
      partialize: (state) => ({ items: state.items }),
      merge: (persistedState, currentState) => {
        if (!persistedState || !Array.isArray(persistedState.items)) {
          return currentState;
        }

        const validItems = [];
        const seenIds = new Set();

        for (const item of persistedState.items) {
          if (!item.productId || !item.slug || !item.name) continue;
          
          const productId = String(item.productId);
          
          if (seenIds.has(productId)) continue; // Deduplicate by productId
          seenIds.add(productId);

          const price = normalizePrice(item.price);

          validItems.push({
            productId,
            slug: String(item.slug),
            name: String(item.name),
            price: price,
            image: item.image?.url ? { url: String(item.image.url) } : null,
          });
        }

        return { ...currentState, items: validItems };
      },
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("Wishlist hydration failed", error);
          if (state) state.clearWishlist();
        }
        if (state) state.setHasHydrated(true);
      },
    }
  )
);

export const selectWishlistItems = (state) => state.items;
export const selectWishlistCount = (state) => state.items.length;
export const selectIsWishlisted = (productId) => (state) => state.items.some((i) => i.productId === productId);
export const selectWishlistHasHydrated = (state) => state._hasHydrated;

export default useWishlistStore;
