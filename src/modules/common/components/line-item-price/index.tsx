import { HttpTypes } from "@medusajs/types"
import { twMerge } from "tailwind-merge"

import { convertToLocale } from "@lib/util/money"

type LineItemPriceProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  currencyCode: string
  className?: string
}

/**
 * Extended (line) total for a cart/order line item: unit_price × quantity, with
 * the pre-sale original struck through when the item is discounted.
 *
 * Derived from the line item's captured price so the sum of all line totals
 * reconciles with the cart Subtotal. Order-level promo discounts are shown
 * separately in the totals breakdown (the "Discount" line), not per row.
 */
const LineItemPrice = ({
  item,
  currencyCode,
  className,
}: LineItemPriceProps) => {
  const quantity = item.quantity ?? 1
  const unitPrice = item.unit_price ?? 0
  const originalUnitPrice = item.compare_at_unit_price
  const hasReducedPrice =
    originalUnitPrice !== undefined && originalUnitPrice > unitPrice

  const lineTotal = unitPrice * quantity
  const originalLineTotal = (originalUnitPrice ?? 0) * quantity

  return (
    <div className={twMerge("flex flex-col items-end", className)}>
      {hasReducedPrice && (
        <span className="text-grayscale-500 line-through text-xs">
          {convertToLocale({
            amount: originalLineTotal,
            currency_code: currencyCode,
          })}
        </span>
      )}
      <span
        className={twMerge(
          "font-semibold",
          hasReducedPrice && "text-red-primary"
        )}
      >
        {convertToLocale({ amount: lineTotal, currency_code: currencyCode })}
      </span>
    </div>
  )
}

export default LineItemPrice
