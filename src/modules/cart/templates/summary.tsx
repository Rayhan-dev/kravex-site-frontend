"use client"

import { HttpTypes } from "@medusajs/types"

import { LocalizedButtonLink, LocalizedLink } from "@/components/LocalizedLink"
import CartTotals from "@modules/cart/components/cart-totals"
import DiscountCode from "@modules/cart/components/discount-code"
import { Icon } from "@/components/Icon"
import { useCustomer } from "hooks/customer"
import { withReactQueryProvider } from "@lib/util/react-query"

type SummaryProps = {
  cart: HttpTypes.StoreCart
}

const Summary = ({ cart }: SummaryProps) => {
  const { data: customer, isPending } = useCustomer()

  return (
    <>
      <CartTotals cart={cart} className="lg:pt-8" />
      <DiscountCode cart={cart} />
      <LocalizedButtonLink
        href="/checkout"
        isFullWidth
        className="mt-6"
      >
        Proceed to checkout
      </LocalizedButtonLink>
      {!customer && !isPending && (
        <div className="bg-black/5 border border-black/10 mt-6 px-4 py-3.5 flex items-center text-black/50 gap-3 text-sm">
          <Icon name="info" className="w-4 h-4 shrink-0 opacity-50" />
          <p>
            Already have an account?{" "}
            <LocalizedLink
              href="/auth/login"
              variant="underline"
              className="text-black !p-0"
            >
              Sign in
            </LocalizedLink>{" "}
            to see your orders.
          </p>
        </div>
      )}
    </>
  )
}

export default withReactQueryProvider(Summary)
