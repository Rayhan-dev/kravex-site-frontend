"use client"

import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { twMerge } from "tailwind-merge"

// Stripe is disabled. Imports preserved for when it's re-enabled.
// import { loadStripe } from "@stripe/stripe-js"
// import type { Stripe, StripeElements } from "@stripe/stripe-js"
// import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
// const stripeKey = process.env.NEXT_PUBLIC_STRIPE_KEY
// const stripePromise = stripeKey ? loadStripe(stripeKey) : null

import {
  useCart,
  useSetEmail,
  useSetShippingAddress,
  useSetShippingMethod,
  useInitiatePaymentSession,
  usePlaceOrder,
  useCartShippingMethods,
  useCartPaymentMethods,
} from "hooks/cart"
import { withReactQueryProvider } from "@lib/util/react-query"
import { convertToLocale } from "@lib/util/money"
import { isManual, paymentInfoMap } from "@lib/constants"
import { Icon } from "@/components/Icon"
import { Button } from "@/components/Button"

// ── Form schema ──────────────────────────────────────────────────────────────
const formSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  name: z.string().min(2, "Enter your full name"),
  phone: z.string().optional(),
  address_1: z.string().min(1, "Enter your address"),
  city: z.string().min(1, "Enter your city"),
  shippingMethodId: z.string().min(1, "Select a shipping method"),
  paymentProviderId: z.string().min(1, "Select a payment method"),
})
type FormValues = z.infer<typeof formSchema>

// ── Input class ──────────────────────────────────────────────────────────────
const inputCls =
  "block w-full h-14 rounded-xs outline-none px-4 border border-black/20 hover:border-black/60 focus:border-black bg-transparent transition-all placeholder:text-black/30 text-black"

// ── Field ────────────────────────────────────────────────────────────────────
const Field: React.FC<{
  label: string
  error?: string
  children: React.ReactNode
  className?: string
}> = ({ label, error, children, className }) => (
  <div className={twMerge("flex flex-col gap-1.5", className)}>
    <span className="text-[10px] tracking-[0.25em] uppercase text-black/40">{label}</span>
    {children}
    {error && <p className="text-xs text-red-900">{error}</p>}
  </div>
)

// ── Section label ─────────────────────────────────────────────────────────────
const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-[10px] tracking-[0.3em] uppercase text-black/40 mb-5">{children}</p>
)

// ── Radio row ────────────────────────────────────────────────────────────────
const RadioRow: React.FC<{
  label: React.ReactNode
  right?: React.ReactNode
  inputProps: React.InputHTMLAttributes<HTMLInputElement>
  checked?: boolean
}> = ({ label, right, inputProps, checked }) => (
  <label
    className={twMerge(
      "flex items-center gap-3 px-4 py-3.5 border cursor-pointer transition-colors",
      checked ? "border-black" : "border-black/15 hover:border-black/40"
    )}
  >
    <input type="radio" {...inputProps} className="w-4 h-4 accent-black shrink-0" />
    <span className="text-sm flex-1">{label}</span>
    {right && <span className="text-sm text-black/50 shrink-0">{right}</span>}
  </label>
)

// ── Core form ────────────────────────────────────────────────────────────────
const CheckoutFormInner: React.FC<{ countryCode: string }> = ({ countryCode }) => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { data: cart } = useCart({ enabled: true })
  const { data: shippingMethods } = useCartShippingMethods(cart?.id ?? "")
  const { data: paymentMethods } = useCartPaymentMethods(cart?.region?.id ?? "")

  const setEmailMutation = useSetEmail()
  const setAddressMutation = useSetShippingAddress()
  const setShippingMutation = useSetShippingMethod({ cartId: cart?.id ?? "" })
  const initiatePaymentMutation = useInitiatePaymentSession()
  const placeOrderMutation = usePlaceOrder()

  const existingName = cart?.shipping_address
    ? [cart.shipping_address.first_name, cart.shipping_address.last_name]
        .filter(Boolean)
        .join(" ")
        .trim()
    : ""

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: cart?.email || "",
      name: existingName,
      phone: cart?.shipping_address?.phone || "",
      address_1: cart?.shipping_address?.address_1 || "",
      city: cart?.shipping_address?.city || "",
      shippingMethodId:
        shippingMethods?.[0]?.id ||
        cart?.shipping_methods?.[0]?.shipping_option_id ||
        "",
      paymentProviderId: "",
    },
  })

  // Auto-select when there's only one shipping method
  useEffect(() => {
    if (shippingMethods?.length === 1) {
      setValue("shippingMethodId", shippingMethods[0].id, { shouldValidate: false })
    }
  }, [shippingMethods, setValue])

  // Auto-select when there's only one payment method (e.g. Cash on Delivery)
  useEffect(() => {
    if (paymentMethods?.length === 1) {
      setValue("paymentProviderId", paymentMethods[0].id, { shouldValidate: false })
    }
  }, [paymentMethods, setValue])

  const selectedProvider = watch("paymentProviderId")
  const selectedShipping = watch("shippingMethodId")

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const parts = values.name.trim().split(" ")
      const first_name = parts[0]
      const last_name = parts.slice(1).join(" ") || " "

      const shippingAddress = {
        first_name,
        last_name,
        address_1: values.address_1,
        address_2: "",
        city: values.city,
        country_code: "bd",
        postal_code: "",
        province: "",
        company: "",
        phone: values.phone || "",
      }

      // 1 — Email
      const emailRes = await setEmailMutation.mutateAsync({
        email: values.email,
        country_code: "bd",
      })
      if (!emailRes?.success) throw new Error(emailRes?.error || "Could not set email")

      // 2 — Address (billing always = shipping)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const addrRes = await setAddressMutation.mutateAsync({
        shipping_address: shippingAddress,
        same_as_billing: "on",
      } as any)
      if (!addrRes?.success) throw new Error(addrRes?.error || "Could not set address")

      // 3 — Shipping method
      await setShippingMutation.mutateAsync({ shippingMethodId: values.shippingMethodId })

      // 4 — Initiate payment session (manual / COD)
      await initiatePaymentMutation.mutateAsync({ providerId: values.paymentProviderId })

      // Stripe card flow (disabled — preserved for re-enabling)
      // if (isStripeProvider(values.paymentProviderId) && stripeHook && elementsHook) { ... }

      // 5 — Place order
      const orderRes = await placeOrderMutation.mutateAsync(null)
      if (orderRes?.type === "order") {
        router.push(`/${countryCode}/order/confirmed/${orderRes.order.id}`)
        return
      }
      if (orderRes?.type === "cart") {
        throw new Error(orderRes.error?.message || "Order could not be placed. Please try again.")
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!cart) {
    return (
      <div className="flex items-center justify-center py-20">
        <Icon name="loader" className="w-8 h-8 animate-spin opacity-30" />
      </div>
    )
  }

  const singlePaymentMethod = paymentMethods?.length === 1 ? paymentMethods[0] : null

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10">

      {/* ── Contact ─────────────────────────────────────────────────────── */}
      <section>
        <SectionLabel>Contact</SectionLabel>
        <div className="flex flex-col gap-4">
          <Field label="Email" error={errors.email?.message}>
            <input
              {...register("email")}
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={inputCls}
            />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full name" error={errors.name?.message}>
              <input
                {...register("name")}
                autoComplete="name"
                placeholder="Rayhan Ahmed"
                className={inputCls}
              />
            </Field>
            <Field label="Phone" error={errors.phone?.message}>
              <input
                {...register("phone")}
                type="tel"
                autoComplete="tel"
                placeholder="+880 1X XX XXX XXX"
                className={inputCls}
              />
            </Field>
          </div>
        </div>
      </section>

      {/* ── Delivery ────────────────────────────────────────────────────── */}
      <section>
        <SectionLabel>Delivery</SectionLabel>
        <div className="flex flex-col gap-4">
          <Field label="Address" error={errors.address_1?.message}>
            <input
              {...register("address_1")}
              autoComplete="address-line1"
              placeholder="Road 12, House 5, Dhanmondi"
              className={inputCls}
            />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="City" error={errors.city?.message}>
              <input
                {...register("city")}
                autoComplete="address-level2"
                placeholder="Dhaka"
                className={inputCls}
              />
            </Field>
            <Field label="Country">
              <div
                className={twMerge(
                  inputCls,
                  "flex items-center text-black/40 select-none cursor-default"
                )}
              >
                Bangladesh
              </div>
            </Field>
          </div>
        </div>
      </section>

      {/* ── Shipping ────────────────────────────────────────────────────── */}
      {shippingMethods && shippingMethods.length > 0 && (
        <section>
          <SectionLabel>Shipping</SectionLabel>
          {shippingMethods.length === 1 ? (
            // Single option — show as read-only confirmation
            <div className="flex items-center justify-between px-4 py-3.5 border border-black/15">
              <span className="text-sm">{shippingMethods[0].name}</span>
              <span className="text-sm text-black/50">
                {convertToLocale({
                  amount: shippingMethods[0].amount ?? 0,
                  currency_code: cart.currency_code,
                })}
              </span>
              <input type="hidden" {...register("shippingMethodId")} />
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                {shippingMethods.map((method) => (
                  <RadioRow
                    key={method.id}
                    label={method.name}
                    right={convertToLocale({
                      amount: method.amount ?? 0,
                      currency_code: cart.currency_code,
                    })}
                    checked={selectedShipping === method.id}
                    inputProps={{ ...register("shippingMethodId"), value: method.id }}
                  />
                ))}
              </div>
              {errors.shippingMethodId && (
                <p className="text-xs text-red-900 mt-2">{errors.shippingMethodId.message}</p>
              )}
            </>
          )}
        </section>
      )}

      {/* ── Payment ─────────────────────────────────────────────────────── */}
      {paymentMethods && paymentMethods.length > 0 && (
        <section>
          <SectionLabel>Payment</SectionLabel>
          {singlePaymentMethod ? (
            // Single option (COD) — show as confirmed, no selector needed
            <div className="flex items-center gap-3 px-4 py-3.5 border border-black/15">
              <div className="w-4 h-4 rounded-full border-[5px] border-black shrink-0" />
              <span className="text-sm">
                {paymentInfoMap[singlePaymentMethod.id]?.title ?? singlePaymentMethod.id}
              </span>
              <input type="hidden" {...register("paymentProviderId")} />
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                {paymentMethods
                  .sort((a, b) => (a.id > b.id ? 1 : -1))
                  .map((method) => (
                    <RadioRow
                      key={method.id}
                      checked={selectedProvider === method.id}
                      label={
                        <span className="flex items-center gap-2">
                          {paymentInfoMap[method.id]?.title ?? method.id}
                          {isManual(method.id) && process.env.NODE_ENV === "development" && (
                            <span className="text-[9px] bg-orange-100 text-orange-700 px-1.5 py-0.5 uppercase tracking-wider">
                              Test
                            </span>
                          )}
                        </span>
                      }
                      right={
                        <span className="text-black/30 [&_svg]:w-5 [&_svg]:h-5">
                          {paymentInfoMap[method.id]?.icon}
                        </span>
                      }
                      inputProps={{ ...register("paymentProviderId"), value: method.id }}
                    />
                  ))}
              </div>
              {errors.paymentProviderId && (
                <p className="text-xs text-red-900 mt-2">{errors.paymentProviderId.message}</p>
              )}
            </>
          )}
        </section>
      )}

      {/* ── Error ────────────────────────────────────────────────────────── */}
      {errorMessage && (
        <div className="border border-red-900/25 bg-red-900/5 px-4 py-3 text-sm text-red-900">
          {errorMessage}
        </div>
      )}

      {/* ── Submit ──────────────────────────────────────────────────────── */}
      <Button
        type="submit"
        className="w-full"
        isLoading={isSubmitting}
        isDisabled={isSubmitting}
      >
        Place order
      </Button>
    </form>
  )
}

// ── Exported component ───────────────────────────────────────────────────────
// Stripe Elements wrapper removed. Re-add when Stripe is re-enabled:
// if (stripePromise) { return <Elements stripe={stripePromise}><CheckoutFormWithStripe /></Elements> }
export const CheckoutForm = withReactQueryProvider<{
  countryCode: string
  step?: string
}>(({ countryCode }) => <CheckoutFormInner countryCode={countryCode} />)
