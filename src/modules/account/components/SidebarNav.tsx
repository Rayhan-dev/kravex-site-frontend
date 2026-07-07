"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { twJoin } from "tailwind-merge"

import { useCountryCode } from "hooks/country-code"
import { LocalizedLink } from "@/components/LocalizedLink"

export const SidebarNav: React.FC = () => {
  const pathName = usePathname()
  const countryCode = useCountryCode()
  const currentPath = pathName.split(`/${countryCode}`)[1]

  return (
    <>
      <LocalizedLink
        href="/account"
        className={twJoin(
          "inline-flex items-start py-4 max-md:whitespace-nowrap text-xs tracking-[0.15em] uppercase",
          currentPath === "/account" ? "font-semibold" : "font-medium text-black/60"
        )}
      >
        Personal &amp; Security
      </LocalizedLink>
      <LocalizedLink
        href="/account/my-orders"
        className={twJoin(
          "inline-flex items-start py-4 max-md:whitespace-nowrap text-xs tracking-[0.15em] uppercase",
          currentPath.startsWith("/account/my-orders") ? "font-semibold" : "font-medium text-black/60"
        )}
      >
        My Orders
      </LocalizedLink>
    </>
  )
}
