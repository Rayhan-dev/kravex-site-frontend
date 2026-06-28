import React from "react"
import { CreditCard } from "@medusajs/icons"

// import Ideal from "@modules/common/icons/ideal"
// import Bancontact from "@modules/common/icons/bancontact"
// import PayPal from "@modules/common/icons/paypal"

/* Map of payment provider_id to their title and icon. */
export const paymentInfoMap: Record<
  string,
  { title: string; icon: React.JSX.Element }
> = {
  // ── Active ──────────────────────────────────────────────────────────────────
  pp_system_default: {
    title: "Cash on Delivery",
    icon: <CreditCard />,
  },

  // ── bKash (coming soon) ──────────────────────────────────────────────────────
  // pp_bkash_bkash: {
  //   title: "bKash",
  //   icon: <CreditCard />,
  // },

  // ── Stripe (disabled) ────────────────────────────────────────────────────────
  // pp_stripe_stripe: {
  //   title: "Credit card",
  //   icon: <CreditCard />,
  // },
  // "pp_stripe-ideal_stripe": {
  //   title: "iDeal",
  //   icon: <Ideal />,
  // },
  // "pp_stripe-bancontact_stripe": {
  //   title: "Bancontact",
  //   icon: <Bancontact />,
  // },

  // ── PayPal (disabled) ────────────────────────────────────────────────────────
  // pp_paypal_paypal: {
  //   title: "PayPal",
  //   icon: <PayPal />,
  // },
}

// Stripe disabled — always returns false. Re-enable when Stripe is restored.
export const isStripe = (_providerId?: string): boolean => false

export const isPaypal = (providerId?: string) => {
  return providerId?.startsWith("pp_paypal")
}

export const isManual = (providerId?: string) => {
  return providerId?.startsWith("pp_system_default")
}
