"use client"
import MobileCheckoutSummary from "@modules/checkout/templates/mobile-checkout-summary"
import { useCart } from "hooks/cart"
import { withReactQueryProvider } from "@lib/util/react-query"
import SkeletonMobileCheckoutSummaryTrigger from "@modules/skeletons/components/skeleton-mobile-summary-trigger"
import { useIsMutating } from "@tanstack/react-query"
import { Icon } from "@/components/Icon"

function MobileCheckoutSummaryWrapper() {
  const { data: cart, isPending, isFetching } = useCart({ enabled: true })
  const isUpdatingShipping =
    useIsMutating({ mutationKey: ["shipping-update"] }) > 0

  if (isPending || !cart) {
    return <SkeletonMobileCheckoutSummaryTrigger />
  }

  const isUpdating = isUpdatingShipping || isFetching

  return (
    <div className="relative">
      <div
        className={
          isUpdating ? "opacity-50 transition-opacity" : "transition-opacity"
        }
      >
        <MobileCheckoutSummary cart={cart} />
      </div>
      {isUpdating && (
        <div className="absolute top-4 right-4">
          <Icon name="loader" className="w-5 h-5 animate-spin opacity-60" />
        </div>
      )}
    </div>
  )
}

export default withReactQueryProvider(MobileCheckoutSummaryWrapper)
