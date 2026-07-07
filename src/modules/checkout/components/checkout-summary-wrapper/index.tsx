"use client"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import { useCart } from "hooks/cart"
import { withReactQueryProvider } from "@lib/util/react-query"
import SkeletonCheckoutSummary from "@modules/skeletons/templates/skeleton-checkout-summary"
import { useIsMutating } from "@tanstack/react-query"
import { Icon } from "@/components/Icon"

function CheckoutSummaryWrapper() {
  const { data: cart, isPending, isFetching } = useCart({ enabled: true })
  const isUpdatingShipping =
    useIsMutating({ mutationKey: ["shipping-update"] }) > 0

  if (isPending || !cart) {
    return <SkeletonCheckoutSummary />
  }

  const isUpdating = isUpdatingShipping || isFetching

  return (
    <div className="relative">
      <div
        className={
          isUpdating ? "opacity-50 transition-opacity" : "transition-opacity"
        }
      >
        <CheckoutSummary cart={cart} />
      </div>
      {isUpdating && (
        <div className="absolute top-0 right-0">
          <Icon name="loader" className="w-5 h-5 animate-spin opacity-60" />
        </div>
      )}
    </div>
  )
}

export default withReactQueryProvider(CheckoutSummaryWrapper)
