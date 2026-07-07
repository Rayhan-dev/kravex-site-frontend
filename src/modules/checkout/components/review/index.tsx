"use client"

import { twJoin } from "tailwind-merge"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/Button"
import PaymentButton from "@modules/checkout/components/payment-button"
import { StoreCart } from "@medusajs/types"

const Review = ({ cart }: { cart: StoreCart }) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "review"

  const previousStepsCompleted =
    cart.shipping_address &&
    cart.shipping_methods &&
    cart.shipping_methods.length > 0 &&
    cart.payment_collection

  return (
    <>
      <div className="flex items-start justify-between mb-6 md:mb-8 border-t border-black/10 pt-8 mt-8">
        <div>
          <p className="text-2xs tracking-[0.3em] uppercase text-black/40 mb-1.5">05</p>
          <p className={twJoin("transition-all duration-75", isOpen ? "font-medium" : "text-black/50")}>
            Review &amp; Place order
          </p>
        </div>
        {!isOpen &&
          previousStepsCompleted &&
          cart?.shipping_address &&
          cart?.billing_address &&
          cart?.email && (
            <Button
              variant="link"
              className="text-xs text-black/50 shrink-0"
              onPress={() => router.push(pathname + "?step=review", { scroll: false })}
            >
              View
            </Button>
          )}
      </div>
      {isOpen && previousStepsCompleted && (
        <>
          <p className="text-sm text-black/50 mb-8 leading-relaxed">
            By placing this order you confirm you have read and accept our Terms of Use, Terms of Sale,
            Returns Policy, and Privacy Policy.
          </p>
          <PaymentButton
            cart={cart}
            selectPaymentMethod={() => router.push(pathname + "?step=payment", { scroll: false })}
          />
        </>
      )}
    </>
  )
}

export default Review
