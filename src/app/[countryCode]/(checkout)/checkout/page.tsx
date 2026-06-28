import React from "react"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCartId } from "@lib/data/cookies"
import { CheckoutForm } from "@modules/checkout/components/checkout-form"

export const metadata: Metadata = {
  title: "Checkout",
}

export default async function Checkout({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const cart = await getCartId()
  if (!cart) {
    return notFound()
  }

  const { countryCode } = await params

  return <CheckoutForm countryCode={countryCode} />
}
