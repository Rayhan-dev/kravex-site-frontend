"use client"

import * as React from "react"
import * as ReactAria from "react-aria-components"
import { twJoin } from "tailwind-merge"
import { useAsyncList } from "react-stately"
import { Hit } from "meilisearch"
import { useRouter, useSearchParams } from "next/navigation"
import { useCountryCode } from "hooks/country-code"
import { MeiliSearchProductHit, searchClient } from "@lib/search-client"
import { getProductPrice } from "@lib/util/get-product-price"
import { getProductsById } from "@lib/data/products"
import Thumbnail from "@modules/products/components/thumbnail"
import { Button } from "@/components/Button"
import { Input } from "@/components/Forms"
import { Icon } from "@/components/Icon"

interface ListItem extends Hit<MeiliSearchProductHit> {
  price: {
    calculated_price_number: number
    calculated_price: string
    original_price_number: number | null
    original_price: string
    currency_code: string | null
    price_type: string | null | undefined
    percentage_diff: string
  } | null
}

export const SearchField: React.FC<{
  countryOptions: {
    country: string | undefined
    region: string
    label: string | undefined
  }[]
  isInputAlwaysShown?: boolean
  /** Extra classes for the outer flex container */
  className?: string
  /** Extra classes for the input width container */
  inputContainerClassName?: string
}> = ({ countryOptions, isInputAlwaysShown, className, inputContainerClassName }) => {
  const router = useRouter()
  const [isInputShown, setIsInputShown] = React.useState(false)
  const countryCode = useCountryCode()
  const region = countryOptions.find((co) => co.country === countryCode)?.region
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("query")

  const list = useAsyncList<ListItem>({
    getKey(item) {
      return item.handle
    },
    load: async ({ filterText, signal }) => {
      const results = await searchClient
        .index("products")
        .search<MeiliSearchProductHit>(filterText, undefined, {
          signal,
        })
      const medusaProducts = await getProductsById({
        ids: results.hits.map((h) => h.id),
        regionId: region!,
      })

      return {
        items: results.hits.map((hit) => {
          const product = medusaProducts.find((p) => p.id === hit.id)
          return {
            ...hit,
            price: getProductPrice({
              product: product!,
            }).cheapestPrice,
          }
        }),
        filterText,
      }
    },
    initialFilterText: searchQuery ?? "",
  })

  const buttonPressHandle = React.useCallback(() => {
    if (!isInputShown) {
      setIsInputShown(true)
    } else if (list.filterText) {
      router.push(`/${countryCode}/search?query=${list.filterText}`)
      if (!isInputAlwaysShown) setIsInputShown(false)
    } else {
      if (!isInputAlwaysShown) setIsInputShown(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInputShown, list.filterText, router, countryCode])

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        if (!isInputAlwaysShown) setIsInputShown(false)
      } else if (e.key === "Enter" && list.filterText) {
        router.push(`/${countryCode}/search?query=${list.filterText}`)
        if (!isInputAlwaysShown) setIsInputShown(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [list.filterText, router, countryCode]
  )

  React.useEffect(() => {
    if (searchQuery && !list.filterText) {
      list.setFilterText(searchQuery)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  React.useEffect(() => {
    if (isInputAlwaysShown) setIsInputShown(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={twJoin("flex", className)}>
      <Button
        onPress={buttonPressHandle}
        variant="ghost"
        className="p-1 text-black shrink-0"
        aria-label="Open search"
      >
        <Icon name="search" className="w-5 h-5" />
      </Button>
      <ReactAria.ComboBox
        allowsCustomValue
        className="overflow-hidden flex-1"
        aria-label="Search"
        items={list.items}
        inputValue={list.filterText}
        onInputChange={list.setFilterText}
        onKeyDown={handleKeyDown}
        isDisabled={!isInputAlwaysShown && !isInputShown}
      >
        <div
          className={twJoin(
            "overflow-hidden transition-width duration-500 h-full",
            inputContainerClassName ?? "max-w-40 md:max-w-30",
            isInputShown ? "w-full" : "md:w-0"
          )}
        >
          <Input className="px-0 disabled:bg-transparent !py-0 h-7 md:h-6 border-black/40 focus:border-black ml-2 md:ml-1" />
        </div>
        <ReactAria.Popover
          placement="bottom end"
          containerPadding={10}
          maxHeight={320}
          offset={8}
          className="max-w-90 md:max-w-95 lg:max-w-98 w-full bg-cream border border-black overflow-y-auto font-hanken"
        >
          <ReactAria.ListBox className="outline-none">
            {(item: ListItem) => (
              <ReactAria.ListBoxItem
                className="relative after:absolute after:content-[''] after:h-px after:bg-black/10 after:-bottom-px after:left-4 after:right-4 last:after:hidden flex items-center gap-3 px-4 py-3 transition-colors hover:bg-black/5 outline-none cursor-pointer"
                key={item.handle}
                id={item.handle}
                href={`/${countryCode}/products/${item.handle}`}
              >
                <Thumbnail
                  thumbnail={item.thumbnail}
                  size="square"
                  className="w-12 shrink-0 border border-black/10"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight truncate">
                    {item.title}
                  </p>
                  <p className="text-black/40 text-[11px] mt-1 uppercase tracking-[0.1em] truncate">
                    {item.variants[0]}
                  </p>
                </div>
                <p className="text-sm font-semibold shrink-0 tabular-nums">
                  {item.price?.calculated_price}
                </p>
              </ReactAria.ListBoxItem>
            )}
          </ReactAria.ListBox>
        </ReactAria.Popover>
      </ReactAria.ComboBox>
    </div>
  )
}
