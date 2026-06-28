"use client"

import React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { twJoin } from "tailwind-merge"
import { z } from "zod"

import { SubmitButton } from "@modules/common/components/submit-button"
import { Button } from "@/components/Button"
import { Form, InputField } from "@/components/Forms"
import { UiCloseButton, UiDialog, UiDialogTrigger } from "@/components/Dialog"
import { UiModal, UiModalOverlay } from "@/components/ui/Modal"
import { Icon } from "@/components/Icon"
import { LoginForm } from "@modules/auth/components/LoginForm"
import ErrorMessage from "@modules/checkout/components/error-message"
import { useCustomer } from "hooks/customer"
import { useSetEmail } from "hooks/cart"
import { StoreCart } from "@medusajs/types"

export const emailFormSchema = z.object({
  email: z.string().min(3).email("Enter a valid email address."),
})

const Email = ({
  countryCode,
  cart,
}: {
  countryCode: string
  cart: StoreCart
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const { data: customer, isPending: customerPending } = useCustomer()

  const isOpen = searchParams.get("step") === "email"

  const { mutate, isPending, data } = useSetEmail()

  const onSubmit = (values: z.infer<typeof emailFormSchema>) => {
    mutate(
      { ...values, country_code: countryCode },
      {
        onSuccess: (res) => {
          if (isOpen && res?.success) {
            router.push(pathname + "?step=delivery", { scroll: false })
          }
        },
      }
    )
  }

  return (
    <>
      <div className="flex items-start justify-between mb-6 md:mb-8">
        <div className="flex-1">
          <p className="text-[10px] tracking-[0.3em] uppercase text-black/40 mb-1.5">01</p>
          <div className="flex flex-wrap items-center gap-4">
            <p className={twJoin("transition-all duration-75", isOpen ? "font-medium" : "text-black/50")}>
              Email
            </p>
            {isOpen && !customer && !customerPending && (
              <p className="text-xs text-black/40">
                Have an account?{" "}
                <UiDialogTrigger>
                  <Button variant="link" className="text-xs text-black/60">Log in</Button>
                  <UiModalOverlay>
                    <UiModal className="relative max-w-108">
                      <UiDialog>
                        <p className="text-md mb-10">Log in</p>
                        <LoginForm
                          redirectUrl={`/${countryCode}/checkout?step=delivery`}
                          handleCheckout={onSubmit}
                        />
                        <UiCloseButton variant="ghost" className="absolute top-4 right-6 p-0">
                          <Icon name="close" className="w-6 h-6" />
                        </UiCloseButton>
                      </UiDialog>
                    </UiModal>
                  </UiModalOverlay>
                </UiDialogTrigger>
              </p>
            )}
          </div>
        </div>
        {!isOpen && (
          <Button
            variant="link"
            className="text-xs text-black/50 shrink-0"
            onPress={() => router.push(pathname + "?step=email")}
          >
            Change
          </Button>
        )}
      </div>

      {isOpen ? (
        <Form
          schema={emailFormSchema}
          onSubmit={onSubmit}
          formProps={{ id: `email` }}
          defaultValues={{ email: cart?.email || "" }}
        >
          {({ watch }) => {
            const formValue = watch("email")
            return (
              <>
                <InputField
                  placeholder="Email"
                  name="email"
                  inputProps={{
                    autoComplete: "email",
                    title: "Enter a valid email address.",
                  }}
                  data-testid="shipping-email-input"
                />
                <SubmitButton className="mt-6 w-full" isLoading={isPending} isDisabled={!formValue}>
                  Continue
                </SubmitButton>
                <ErrorMessage error={data?.error} />
              </>
            )
          }}
        </Form>
      ) : cart?.email ? (
        <div className="grid grid-cols-[6rem_1fr] gap-y-1.5 text-sm">
          <span className="text-black/40">Email</span>
          <span className="text-black/70 break-all">{cart.email}</span>
        </div>
      ) : null}
    </>
  )
}

export default Email
