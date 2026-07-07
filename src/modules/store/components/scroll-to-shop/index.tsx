"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"

/**
 * When the store page is opened with an active filter (a type or collection,
 * e.g. from the nav), smoothly scroll down to the shop section so the user
 * sees the motion instead of an instant jump.
 */
export const ScrollToShop = () => {
  const searchParams = useSearchParams()
  const typeParam = searchParams.get("type")
  const collectionParam = searchParams.get("collection")

  useEffect(() => {
    if (!typeParam && !collectionParam) return

    const el = document.getElementById("shop")
    if (!el) return

    // Wait a tick so the page paints at the top first, then animate down.
    const timer = window.setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 120)

    return () => window.clearTimeout(timer)
  }, [typeParam, collectionParam])

  return null
}
