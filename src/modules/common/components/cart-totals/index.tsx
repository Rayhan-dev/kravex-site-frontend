"use client"

import React from "react"
import { HttpTypes } from "@medusajs/types"

import { convertToLocale } from "@lib/util/money"

type CartTotalsProps = {
  cart: HttpTypes.StoreCart
}

const CartTotals: React.FC<CartTotalsProps> = ({ cart }) => {
  const {
    currency_code,
    total,
    // `cart.subtotal` includes shipping (item_subtotal + shipping_subtotal), so
    // use `item_subtotal` here to show items only. Shipping is its own line and
    // is added into the Total below.
    item_subtotal,
    tax_total,
    discount_total,
    shipping_total,
    gift_card_total,
  } = cart

  return (
    <div>
      <div className="flex flex-col gap-2 lg:gap-1 mb-8">
        <div className="flex justify-between max-lg:text-xs">
          <div>
            <p>Subtotal</p>
          </div>
          <div className="self-end">
            <p>{convertToLocale({ amount: item_subtotal ?? 0, currency_code })}</p>
          </div>
        </div>
        {!!discount_total && (
          <div className="flex justify-between max-lg:text-xs">
            <div>
              <p>Discount</p>
            </div>
            <div className="self-end">
              <p>
                -{" "}
                {convertToLocale({
                  amount: discount_total ?? 0,
                  currency_code,
                })}
              </p>
            </div>
          </div>
        )}
        <div className="flex justify-between max-lg:text-xs">
          <div>
            <p>Shipping</p>
          </div>
          <div className="self-end">
            <p>
              {convertToLocale({ amount: shipping_total ?? 0, currency_code })}
            </p>
          </div>
        </div>
        <div className="flex justify-between max-lg:text-xs">
          <div>
            <p>Taxes</p>
          </div>
          <div className="self-end">
            <p>{convertToLocale({ amount: tax_total ?? 0, currency_code })}</p>
          </div>
        </div>
        {!!gift_card_total && (
          <div className="flex justify-between max-lg:text-xs">
            <div>
              <p>Gift card</p>
            </div>
            <div className="self-end">
              <p>
                -{" "}
                {convertToLocale({
                  amount: gift_card_total ?? 0,
                  currency_code,
                })}
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-between text-md border-t border-black/10 pt-4">
        <p>Total</p>
        <p>{convertToLocale({ amount: total ?? 0, currency_code })}</p>
      </div>
    </div>
  )
}

export default CartTotals
