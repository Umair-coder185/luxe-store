import { create } from "zustand";
import { persist } from "zustand/middleware";

const normalizeQuantity = (val) => {
  const num = Number(val);
  if (!Number.isFinite(num)) return 1;
  return Math.max(1, Math.floor(num));
};

const normalizePrice = (val) => {
  const num = Number(val);
  if (!Number.isFinite(num)) return 0;
  return Math.max(0, num);
};

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      _hasHydrated: false,

      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },

      addItem: (item) => {
        if (!item.productId || !item.slug || !item.name) return;
        const quantity = normalizeQuantity(item.quantity);
        const price = normalizePrice(item.price);
        
        const lineId = item.variantId ? `${item.productId}-${item.variantId}` : item.productId;

        set((state) => {
          const existingItemIndex = state.items.findIndex((i) => {
            const iLineId = i.variantId ? `${i.productId}-${i.variantId}` : i.productId;
            return iLineId === lineId;
          });

          if (existingItemIndex > -1) {
            const newItems = [...state.items];
            const existingItem = newItems[existingItemIndex];
            newItems[existingItemIndex] = {
              ...existingItem,
              quantity: existingItem.quantity + quantity,
            };
            return { items: newItems };
          } else {
            const newItem = {
              productId: item.productId,
              slug: item.slug,
              name: item.name,
              price: price,
              image: item.image?.url ? { url: item.image.url } : null,
              variantId: item.variantId || null,
              size: item.size || null,
              color: item.color || null,
              quantity: quantity,
            };
            return { items: [...state.items, newItem] };
          }
        });
      },

      removeItem: (lineId) => {
        set((state) => ({
          items: state.items.filter((i) => {
            const iLineId = i.variantId ? `${i.productId}-${i.variantId}` : i.productId;
            return iLineId !== lineId;
          }),
        }));
      },

      updateQuantity: (lineId, quantity) => {
        const normalizedQuantity = normalizeQuantity(quantity);
        
        set((state) => ({
          items: state.items.map((i) => {
            const iLineId = i.variantId ? `${i.productId}-${i.variantId}` : i.productId;
            if (iLineId === lineId) {
              return { ...i, quantity: normalizedQuantity };
            }
            return i;
          }),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },
    }),
    {
      name: "luxe-cart",
      version: 1,
      partialize: (state) => ({ items: state.items }),
      merge: (persistedState, currentState) => {
        if (!persistedState || !Array.isArray(persistedState.items)) {
          return currentState;
        }

        const validItems = persistedState.items.reduce((acc, item) => {
          if (!item.productId || !item.slug || !item.name) return acc;
          const quantity = normalizeQuantity(item.quantity);
          const price = normalizePrice(item.price);

          acc.push({
            productId: String(item.productId),
            slug: String(item.slug),
            name: String(item.name),
            price: price,
            image: item.image?.url ? { url: String(item.image.url) } : null,
            variantId: item.variantId ? String(item.variantId) : null,
            size: item.size ? String(item.size) : null,
            color: item.color ? String(item.color) : null,
            quantity: quantity,
          });
          return acc;
        }, []);

        return { ...currentState, items: validItems };
      },
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          // If Zustand fails to read from storage entirely, reset to initial state cleanly
          console.error("Cart hydration failed", error);
          if (state) state.clearCart();
        }
        if (state) state.setHasHydrated(true);
      },
    }
  )
);

export const selectCartItems = (state) => state.items;
export const selectCartCount = (state) => state.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartSubtotal = (state) => state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
export const selectCartHasHydrated = (state) => state._hasHydrated;

export default useCartStore;
