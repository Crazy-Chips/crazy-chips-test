'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Extra } from '@/types'

interface CartStore {
  items: CartItem[]
  promoCode: string | null
  discount: number
  addItem: (item: CartItem) => void
  removeItem: (menuItemId: string) => void
  updateQuantity: (menuItemId: string, quantity: number) => void
  applyPromo: (code: string, discount: number) => void
  clearPromo: () => void
  clearCart: () => void
  subtotal: () => number
  total: () => number
  itemCount: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: null,
      discount: 0,

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.menuItemId === item.menuItemId)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.menuItemId === item.menuItemId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            }
          }
          return { items: [...state.items, item] }
        }),

      removeItem: (menuItemId) =>
        set((state) => ({
          items: state.items.filter((i) => i.menuItemId !== menuItemId),
        })),

      updateQuantity: (menuItemId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((i) => i.menuItemId !== menuItemId) }
          }
          return {
            items: state.items.map((i) =>
              i.menuItemId === menuItemId ? { ...i, quantity } : i
            ),
          }
        }),

      applyPromo: (code, discount) => set({ promoCode: code, discount }),
      clearPromo: () => set({ promoCode: null, discount: 0 }),

      clearCart: () => set({ items: [], promoCode: null, discount: 0 }),

      subtotal: () => {
        const { items } = get()
        return items.reduce((sum, item) => {
          const extrasTotal = item.extras.reduce((e, ex) => e + ex.price, 0)
          return sum + (item.price + extrasTotal) * item.quantity
        }, 0)
      },

      total: () => {
        const { discount } = get()
        const sub = get().subtotal()
        return sub - (sub * discount) / 100
      },

      itemCount: () => {
        const { items } = get()
        return items.reduce((sum, i) => sum + i.quantity, 0)
      },
    }),
    {
      name: 'crazy-chips-cart',
    }
  )
)
