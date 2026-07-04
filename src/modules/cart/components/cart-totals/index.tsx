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
    subtotal,
    tax_total,
    shipping_total,
    discount_total,
    gift_card_total,
  } = cart

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
          <p data-testid="cart-subtotal" data-value={subtotal || 0}>
            {convertToLocale({ amount: subtotal ?? 0, currency_code })}
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
          <p className="text-black/50">Shipping</p>
          <p data-testid="cart-shipping" data-value={shipping_total || 0}>
            {convertToLocale({ amount: shipping_total ?? 0, currency_code })}
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
