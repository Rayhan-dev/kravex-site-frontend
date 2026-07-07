"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { twJoin } from "tailwind-merge"
import { convertToLocale } from "@lib/util/money"
import ErrorMessage from "@modules/checkout/components/error-message"
import { Button } from "@/components/Button"
import {
  UiRadio,
  UiRadioBox,
  UiRadioGroup,
  UiRadioLabel,
} from "@/components/ui/Radio"
import { useCartShippingMethods, useSetShippingMethod } from "hooks/cart"
import { StoreCart } from "@medusajs/types"

const Shipping = ({ cart }: { cart: StoreCart }) => {
  const [error, setError] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "shipping"

  const { data: availableShippingMethods } = useCartShippingMethods(cart.id)

  const { mutate, isPending } = useSetShippingMethod({ cartId: cart.id })
  const selectedShippingMethod = availableShippingMethods?.find(
    (method) => method.id === cart.shipping_methods?.[0]?.shipping_option_id
  )

  const handleSubmit = () => {
    router.push(pathname + "?step=payment", { scroll: false })
  }

  const set = (id: string) => {
    mutate(
      { shippingMethodId: id },
      { onError: (err) => setError(err.message) }
    )
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  return (
    <>
      <div className="flex items-start justify-between mb-6 md:mb-8 border-t border-black/10 pt-8 mt-8">
        <div>
          <p className="text-2xs tracking-[0.3em] uppercase text-black/40 mb-1.5">03</p>
          <p className={twJoin("transition-all duration-75", isOpen ? "font-medium" : "text-black/50")}>
            Shipping
          </p>
        </div>
        {!isOpen && cart?.shipping_address && cart?.billing_address && cart?.email && (
          <Button
            variant="link"
            className="text-xs text-black/50 shrink-0"
            onPress={() => router.push(pathname + "?step=shipping", { scroll: false })}
          >
            Change
          </Button>
        )}
      </div>
      {isOpen ? (
        availableShippingMethods?.length === 0 ? (
          <div>
            <p className="text-red-900">
              There are no shipping methods available for your location. Please
              contact us for further assistance.
            </p>
          </div>
        ) : (
          <div>
            <UiRadioGroup
              className="flex flex-col gap-4 mb-8"
              value={selectedShippingMethod?.id}
              onChange={set}
              aria-label="Shipping methods"
            >
              {availableShippingMethods?.map((option) => (
                <UiRadio
                  key={option.id}
                  variant="outline"
                  value={option.id}
                  className="gap-4"
                >
                  <UiRadioBox />
                  <UiRadioLabel>{option.name}</UiRadioLabel>
                  <UiRadioLabel className="ml-auto group-data-[selected=true]:font-normal">
                    {convertToLocale({
                      amount: option.amount!,
                      currency_code: cart?.currency_code,
                    })}
                  </UiRadioLabel>
                </UiRadio>
              ))}
            </UiRadioGroup>

            <ErrorMessage error={error} />

            <Button
              className="w-full"
              onPress={handleSubmit}
              isLoading={isPending}
              isDisabled={!cart.shipping_methods?.[0]}
            >
              Continue
            </Button>
          </div>
        )
      ) : cart &&
        (cart.shipping_methods?.length ?? 0) > 0 &&
        selectedShippingMethod ? (
        <div className="grid grid-cols-[7rem_1fr] gap-x-4 text-sm">
          <span className="text-black/40">Method</span>
          <span className="text-black/70">{selectedShippingMethod.name}</span>
        </div>
      ) : null}
    </>
  )
}

export default Shipping
