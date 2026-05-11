import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WishlistItem } from '../types'

interface WishlistState {
  items: WishlistItem[]
  addItem: (partId: string, defaultQty: number) => void
  removeItem: (partId: string) => void
  updateQty: (partId: string, qty: number) => void
  updateNote: (partId: string, note: string) => void
  clearAll: () => void
  isInWishlist: (partId: string) => boolean
  getItem: (partId: string) => WishlistItem | undefined
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (partId, defaultQty) => {
        if (get().isInWishlist(partId)) return
        if (get().items.length >= 200) return // security cap
        set(state => ({
          items: [...state.items, { partId, qty: defaultQty, addedAt: new Date().toISOString() }]
        }))
      },

      removeItem: (partId) =>
        set(state => ({ items: state.items.filter(i => i.partId !== partId) })),

      updateQty: (partId, qty) => {
        if (qty < 1) return
        set(state => ({
          items: state.items.map(i => i.partId === partId ? { ...i, qty } : i)
        }))
      },

      updateNote: (partId, note) =>
        set(state => ({
          items: state.items.map(i => i.partId === partId ? { ...i, note } : i)
        })),

      clearAll: () => set({ items: [] }),

      isInWishlist: (partId) => get().items.some(i => i.partId === partId),

      getItem: (partId) => get().items.find(i => i.partId === partId),
    }),
    {
      name: 'mf1014_wishlist',
      version: 1,
    }
  )
)
