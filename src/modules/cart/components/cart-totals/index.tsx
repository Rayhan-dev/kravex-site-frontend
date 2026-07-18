"use client"

import { HttpTypes } from "@medusajs/types"
import React from "react"

import { convertToLocale } from "@lib/util/money"
import { twMerge } from "tailwind-merge"

type CartTotalsProps = {
  cart: HttpTypes.StoreCart
  isPartOfCartDrawer?: boolean
  className?: string
}

const CartTotals: React.FC<CartTotalsProps> = ({
  cart,
  isPartOfCartDrawer,
  className,
}) => {
  const {
    currency_code,
    total,
    // `cart.subtotal` includes shipping (item_subtotal + shipping_subtotal), so
    // use `item_subtotal` here to show items only. Shipping is its own line and
    // is added into the Total below.
    item_subtotal,
    tax_total,
    shipping_total,
    discount_total,
    gift_card_total,
  } = cart

  // No shipping method chosen yet (e.g. on the cart page) — shipping isn't known
  // until checkout, so show a placeholder instead of a misleading 0.
  const hasShippingMethod = Boolean(cart.shipping_methods?.length)

  return (
    <div className={className}>
      <div
        className={twMerge(
          "flex flex-col gap-3",
          isPartOfCartDrawer && "gap-2"
        )}
      >
        <div className="flex justify-between text-sm">
          <p className="text-black/50">Subtotal</p>
          <p data-testid="cart-subtotal" data-value={item_subtotal || 0}>
            {convertToLocale({ amount: item_subtotal ?? 0, currency_code })}
          </p>
        </div>
        {!!discount_total && (
          <div className="flex justify-between text-sm">
            <p className="text-black/50">Discount</p>
            <p data-testid="cart-discount" data-value={discount_total || 0}>
              -{" "}
              {convertToLocale({ amount: discount_total ?? 0, currency_code })}
            </p>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <p className="text-black/50">
            Shipping
            {isPartOfCartDrawer && (
              <span className="block text-xs text-black/40">
                May change at checkout
              </span>
            )}
          </p>
          <p data-testid="cart-shipping" data-value={shipping_total || 0}>
            {hasShippingMethod
              ? convertToLocale({ amount: shipping_total ?? 0, currency_code })
              : "Calculated at checkout"}
          </p>
        </div>
        {!!tax_total && (
          <div className="flex justify-between text-sm">
            <p className="text-black/50">Taxes</p>
            <p data-testid="cart-taxes" data-value={tax_total || 0}>
              {convertToLocale({ amount: tax_total ?? 0, currency_code })}
            </p>
          </div>
        )}
        {!!gift_card_total && (
          <div className="flex justify-between text-sm">
            <p className="text-black/50">Gift card</p>
            <p
              data-testid="cart-gift-card-amount"
              data-value={gift_card_total || 0}
            >
              -{" "}
              {convertToLocale({ amount: gift_card_total ?? 0, currency_code })}
            </p>
          </div>
        )}
      </div>

      <div
        className={twMerge(
          "border-t border-black/10",
          isPartOfCartDrawer ? "my-4" : "my-6"
        )}
      />

      <div className="flex justify-between font-medium">
        <p>Total</p>
        <p data-testid="cart-total" data-value={total || 0}>
          {convertToLocale({ amount: total ?? 0, currency_code })}
        </p>
      </div>
    </div>
  )
}

export default CartTotals
