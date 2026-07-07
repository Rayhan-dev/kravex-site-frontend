"use client"

import * as React from "react"
import { Button } from "@/components/Button"
import { Icon } from "@/components/Icon"
import { Drawer } from "@/components/Drawer"
import { LocalizedLink } from "@/components/LocalizedLink"
import { SearchField } from "@/components/SearchField"
import { useSearchParams } from "next/navigation"

export const HeaderDrawer: React.FC<{
  countryOptions: {
    country: string | undefined
    region: string
    label: string | undefined
  }[]
  productTypes?: { id: string; value: string }[]
}> = ({ countryOptions, productTypes = [] }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("query")

  React.useEffect(() => {
    if (searchQuery) setIsMenuOpen(false)
  }, [searchQuery])

  return (
    <>
      <Button
        variant="ghost"
        className="p-1 text-black"
        onPress={() => setIsMenuOpen(true)}
        aria-label="Open menu"
      >
        <Icon name="menu" className="w-6 h-6" wrapperClassName="w-6 h-6" />
      </Button>
      <Drawer
        animateFrom="left"
        isOpen={isMenuOpen}
        onOpenChange={setIsMenuOpen}
        colorScheme="light"
        className="rounded-none !p-0 bg-[#ede8d0]"
      >
        {({ close }) => (
          <div className="flex flex-col h-full text-black">
            {/* Header: brand + close */}
            <div className="flex items-center justify-between px-8 h-18 border-b border-black/10 shrink-0">
              <span className="font-bebas text-[1.75rem] tracking-[0.05em] leading-none">
                Kravex
              </span>
              <button
                onClick={close}
                aria-label="Close menu"
                className="opacity-50 hover:opacity-100 transition-opacity"
              >
                <Icon name="close" className="w-5 h-5" />
              </button>
            </div>

            {/* Search */}
            <div className="px-8 py-3.5 border-b border-black/10 shrink-0">
              <SearchField
                countryOptions={countryOptions}
                isInputAlwaysShown
                className="w-full"
                inputContainerClassName="flex-1 max-w-full w-full"
              />
            </div>

            {/* Nav links */}
            <nav className="flex flex-col px-8 pt-8 pb-12">
              <LocalizedLink
                href="/store"
                onClick={() => setIsMenuOpen(false)}
                className="text-xs tracking-[0.2em] uppercase font-medium hover:opacity-100 py-4"
              >
                Shop All
              </LocalizedLink>
              {productTypes.map((type) => (
                <React.Fragment key={type.id}>
                  <div className="w-6 h-px bg-black/15" />
                  <LocalizedLink
                    href={`/store?type=${encodeURIComponent(type.value)}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-xs tracking-[0.2em] uppercase font-medium hover:opacity-100 py-4"
                  >
                    {type.value}
                  </LocalizedLink>
                </React.Fragment>
              ))}
            </nav>
          </div>
        )}
      </Drawer>
    </>
  )
}
