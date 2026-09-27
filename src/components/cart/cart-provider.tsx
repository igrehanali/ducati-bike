"use client"

import { createContext, lazy, Suspense, useContext, useState, type ReactNode } from "react"

// The drawer (and the catalog data it uses for upsells) is only downloaded the first time it opens.
// React.lazy (not next/dynamic) so nothing is preloaded before it's needed.
const CartSheet = lazy(() => import("@/components/cart/cart-sheet").then((m) => ({ default: m.CartSheet })))

type CartUI = {
  open: boolean
  setOpen: (open: boolean) => void
}

const CartUIContext = createContext<CartUI | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [open, setOpenState] = useState(false)
  const [requested, setRequested] = useState(false)

  function setOpen(next: boolean) {
    if (next) setRequested(true)
    setOpenState(next)
  }

  return (
    <CartUIContext.Provider value={{ open, setOpen }}>
      {children}
      {requested ? (
        <Suspense fallback={null}>
          <CartSheet open={open} onOpenChange={setOpen} />
        </Suspense>
      ) : null}
    </CartUIContext.Provider>
  )
}

export function useCartUI() {
  const context = useContext(CartUIContext)
  if (!context) throw new Error("useCartUI must be used within <CartProvider>")
  return context
}
