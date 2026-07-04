"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

import { Layout, LayoutColumn } from "@/components/Layout"
import { CollectionFilter } from "@modules/store/components/refinement-list/collection-filter"
import { MobileFilters } from "@modules/store/components/refinement-list/mobile-filters"
import { MobileSort } from "@modules/store/components/refinement-list/mobile-sort"
import SortProducts, {
  SortOptions,
} from "@modules/store/components/refinement-list/sort-products"
import { TypeFilter } from "@modules/store/components/refinement-list/type-filter"

type RefinementListProps = {
  title?: string
  collections?: Record<string, string>
  collection?: string[]
  types?: Record<string, string>
  type?: string[]
  sortBy: SortOptions | undefined
  "data-testid"?: string
}

const RefinementList = ({
  title = "Shop",
  collections,
  collection,
  types,
  type,
  sortBy,
  "data-testid": dataTestId,
}: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const setQueryParams = useCallback(
    (name: string, value: string | string[]) => {
      const query = new URLSearchParams(searchParams)

      if (Array.isArray(value)) {
        query.delete(name)
        value.forEach((v) => query.append(name, v))
      } else {
        query.set(name, value)
      }

      router.push(`${pathname}?${query.toString()}`, { scroll: false })
    },
    [pathname, router, searchParams]
  )

  const setMultipleQueryParams = useCallback(
    (params: Record<string, string | string[]>) => {
      const query = new URLSearchParams(searchParams)

      Object.entries(params).forEach(([name, value]) => {
        if (Array.isArray(value)) {
          query.delete(name)
          value.forEach((v) => query.append(name, v))
        } else {
          query.set(name, value)
        }
      })

      router.push(`${pathname}?${query.toString()}`, { scroll: false })
    },
    [searchParams, pathname, router]
  )

  return (
    <Layout className="mb-6 md:mb-8">
      <LayoutColumn>
        <h2 className="font-bebas leading-none mb-6 md:mb-7" id="products" style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)", letterSpacing: "0.02em" }}>
          {title}
        </h2>
        <div className="flex justify-between gap-10">
          <MobileFilters
            collections={collections}
            collection={collection}
            types={types}
            type={type}
            setMultipleQueryParams={setMultipleQueryParams}
          />
          <MobileSort sortBy={sortBy} setQueryParams={setQueryParams} />
          <div className="flex justify-between gap-4 max-md:hidden">
            {typeof collections !== "undefined" && (
              <CollectionFilter
                collections={collections}
                collection={collection}
                setQueryParams={setQueryParams}
              />
            )}
            {typeof types !== "undefined" && (
              <TypeFilter
                types={types}
                type={type}
                setQueryParams={setQueryParams}
              />
            )}
          </div>
          <SortProducts
            sortBy={sortBy}
            setQueryParams={setQueryParams}
            data-testid={dataTestId}
          />
        </div>
      </LayoutColumn>
    </Layout>
  )
}

export default RefinementList
