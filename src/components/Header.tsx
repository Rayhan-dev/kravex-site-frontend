import * as React from "react"
import { listRegions } from "@lib/data/regions"
import { getProductTypesList } from "@lib/data/product-types"
import { SearchField } from "@/components/SearchField"
import { Layout, LayoutColumn } from "@/components/Layout"
import { LocalizedLink } from "@/components/LocalizedLink"
import { HeaderDrawer } from "@/components/HeaderDrawer"
import { HeaderWrapper } from "@/components/HeaderWrapper"

import dynamic from "next/dynamic"

const LoginLink = dynamic(
  () => import("@modules/header/components/LoginLink"),
  { loading: () => <></> }
)

const CartDrawer = dynamic(
  () => import("@/components/CartDrawer").then((mod) => mod.CartDrawer),
  { loading: () => <></> }
)

const CartButton = dynamic(
  () => import("@/components/CartDrawer").then((mod) => mod.CartButton),
  { loading: () => <></> }
)

export const Header: React.FC = async () => {
  const [regions, { productTypes }] = await Promise.all([
    listRegions(),
    getProductTypesList(0, 100, ["id", "value"]),
  ])

  const navTypes = productTypes
    .filter((t) => t.value)
    .map((t) => ({ id: t.id, value: t.value! }))

  const countryOptions = regions
    .map((r) => {
      return (r.countries ?? []).map((c) => ({
        country: c.iso_2,
        region: r.id,
        label: c.display_name,
      }))
    })
    .flat()
    .sort((a, b) => (a?.label ?? "").localeCompare(b?.label ?? ""))

  return (
    <>
      <HeaderWrapper>
        <Layout>
          <LayoutColumn>
            <div className="flex justify-between items-center h-18 md:h-21">
              <h1 className="leading-none">
                <LocalizedLink href="/" className="font-bebas text-[1.75rem] tracking-[0.05em] leading-none">Kravex</LocalizedLink>
              </h1>
              <div className="flex items-center gap-6 max-md:hidden">
                <LocalizedLink href="/store" className="text-xs tracking-[0.15em] uppercase font-medium">Shop All</LocalizedLink>
                {navTypes.map((type) => (
                  <React.Fragment key={type.id}>
                    <span className="h-3 w-px bg-black/25 shrink-0" aria-hidden />
                    <LocalizedLink
                      href={`/store?type=${encodeURIComponent(type.value)}`}
                      className="text-xs tracking-[0.15em] uppercase font-medium"
                    >
                      {type.value}
                    </LocalizedLink>
                  </React.Fragment>
                ))}
              </div>
              <div className="flex items-center gap-3 lg:gap-6 max-md:hidden">
                <React.Suspense>
                  <SearchField countryOptions={countryOptions} />
                </React.Suspense>
                <LoginLink className="p-1 text-black" />
                <CartButton />
              </div>
              <div className="flex items-center gap-4 md:hidden">
                <LoginLink className="p-1 text-black" />
                <CartButton />
                <React.Suspense>
                  <HeaderDrawer
                    countryOptions={countryOptions}
                    productTypes={navTypes}
                  />
                </React.Suspense>
              </div>
            </div>
          </LayoutColumn>
        </Layout>
      </HeaderWrapper>
      {/* Single drawer overlay for the whole app (rendered once). */}
      <CartDrawer />
    </>
  )
}
