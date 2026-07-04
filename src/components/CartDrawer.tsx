"use client"

import * as React from "react"
import Item from "@modules/cart/components/item"
import CartTotals from "@modules/cart/components/cart-totals"
import { LocalizedButtonLink, LocalizedLink } from "@/components/LocalizedLink"
import { Drawer } from "@/components/Drawer"
import { Button } from "@/components/Button"
import DiscountCode from "@modules/cart/components/discount-code"
import { Icon } from "@/components/Icon"
import { useCart, useCartQuantity, useCartShippingMethods, useSetShippingMethod } from "hooks/cart"
import { withReactQueryProvider } from "@lib/util/react-query"

// The cart button lives in both the desktop and mobile header clusters, but the
// drawer overlay must exist exactly once — otherwise two React Aria overlays
// portal to the body and stack, so every close/click-outside/delete only affects
// the top one (the "do it twice / flicker" bug). The button therefore just fires
// an event, and a single <CartDrawer /> instance listens for it.
const openCart = () => {
  window.dispatchEvent(new CustomEvent("kravex:cart-open"))
}

/**
 * Cart trigger button with quantity badge. Safe to render multiple times.
 */
export const CartButton = withReactQueryProvider(() => {
  const { data: quantity, isPending: pendingQuantity } = useCartQuantity()

  return (
    <Button
      onPress={openCart}
      variant="ghost"
      className="p-1 text-black"
      aria-label="Open cart"
    >
      {pendingQuantity ? (
        <Icon name="case" className=" w-6 h-6" />
      ) : (
        <Icon
          name="case"
          className=" w-6 h-6"
          status={quantity && quantity > 0 ? quantity : undefined}
        />
      )}
    </Button>
  )
})

/**
 * The cart drawer overlay. Render this exactly once.
 */
export const CartDrawer = withReactQueryProvider(() => {
  const [isCartDrawerOpen, setIsCartDrawerOpen] = React.useState(false)

  const { data: cart, isPending } = useCart({ enabled: isCartDrawerOpen })

  const cartId = cart?.id ?? ""
  const hasItems = Boolean(cart?.items?.length)
  const hasShippingMethod = Boolean(cart?.shipping_methods?.length)

  const { data: shippingOptions } = useCartShippingMethods(cartId)
  const setShippingMethod = useSetShippingMethod({ cartId })

  // Open the drawer on an explicit open request or when an item is added.
  React.useEffect(() => {
    const open = () => setIsCartDrawerOpen(true)
    window.addEventListener("kravex:cart-open", open)
    window.addEventListener("kravex:cart-add", open)
    return () => {
      window.removeEventListener("kravex:cart-open", open)
      window.removeEventListener("kravex:cart-add", open)
    }
  }, [])

  // Auto-apply the first available shipping method when the cart has items
  // but no shipping method set yet (so shipping_total is always accurate in the drawer)
  React.useEffect(() => {
    if (!cartId || !hasItems || hasShippingMethod) return
    if (!shippingOptions?.length) return
    setShippingMethod.mutate({ shippingMethodId: shippingOptions[0].id })
  }, [cartId, hasItems, hasShippingMethod, shippingOptions])

  return (
    <Drawer
      colorScheme="light"
      animateFrom="right"
      isOpen={isCartDrawerOpen}
      onOpenChange={setIsCartDrawerOpen}
      className="max-sm:max-w-100 max-w-139 max-sm:px-6 px-12 pt-10 bg-[#ede8d0]"
    >
      {({ close }) => (
        <>
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-black/10">
            <p className="font-bebas text-[1.5rem] leading-none tracking-[0.05em]">Cart</p>
            <button onClick={close} aria-label="Close cart" className="opacity-50 hover:opacity-100 transition-opacity">
              <Icon name="close" className="w-5" />
            </button>
          </div>
          {cart?.items?.length ? (
            <>
              <div className="pb-8 pr-3 sm:pr-4 overflow-y-scroll">
                {[...cart.items]
                  .sort((a, b) => {
                    // Newest first. Copy before sorting so we never mutate the
                    // React Query cache during render, and tie-break on id so
                    // equal timestamps keep a stable order across renders
                    // (otherwise rows reorder mid-click and eat the click).
                    const at = (v?: Date | string | null) =>
                      v ? new Date(v).getTime() : 0
                    const byDate = at(b.created_at) - at(a.created_at)
                    return byDate !== 0 ? byDate : a.id.localeCompare(b.id)
                  })
                  .map((item) => {
                    return (
                      <Item
                        key={item.id}
                        item={item}
                        className="py-6 last:pb-0 last:border-b-0"
                      />
                    )
                  })}
              </div>
              <div className="sticky left-0 bg-[#ede8d0] bottom-0 pt-4 border-t border-black/10 mt-auto">
                <CartTotals isPartOfCartDrawer cart={cart} />
                <DiscountCode cart={cart} className="mt-6" />
                <LocalizedButtonLink
                  href="/checkout"
                  isFullWidth
                  className="mt-4"
                >
                  Proceed to checkout
                </LocalizedButtonLink>
              </div>
            </>
          ) : isPending ? (
            <div className="flex align-middle justify-around items-center h-screen">
              <Icon name="loader" className="w-10 md:w-15 animate-spin" />
            </div>
          ) : (
            <>
              <p className="text-sm max-sm:mr-10 mb-6 mt-2 text-black/50">
                Your cart is empty. Start browsing below.
              </p>
              <LocalizedLink
                href="/store"
                className="contrast-btn inline-block"
                onClick={() => setIsCartDrawerOpen(false)}
              >
                Shop all blades
              </LocalizedLink>
            </>
          )}
        </>
      )}
    </Drawer>
  )
})
