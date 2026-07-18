import { HttpTypes } from "@medusajs/types"
import { twMerge } from "tailwind-merge"

import { convertToLocale } from "@lib/util/money"

type LineItemUnitPriceProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  currencyCode: string
  className?: string
  regularPriceClassName?: string
}

/**
 * Per-unit price for a cart/order line item.
 *
 * Reads the price captured on the line item itself (`unit_price`, and the
 * original `compare_at_unit_price` for the sale strike-through) rather than
 * re-deriving it from the live product variant. This keeps every row consistent
 * with the cart totals (Subtotal = sum of unit_price × quantity) and reflects
 * the actual price the customer is charged, even if the product's live price
 * changes after the item was added.
 */
const LineItemUnitPrice = ({
  item,
  currencyCode,
  className,
  regularPriceClassName,
}: LineItemUnitPriceProps) => {
  const unitPrice = item.unit_price ?? 0
  const originalUnitPrice = item.compare_at_unit_price
  const hasReducedPrice =
    originalUnitPrice !== undefined && originalUnitPrice > unitPrice

  return (
    <div className={className}>
      {hasReducedPrice ? (
        <>
          <p className="text-base sm:text-sm font-semibold text-red-900">
            {convertToLocale({ amount: unitPrice, currency_code: currencyCode })}
          </p>
          <p className="text-grayscale-500 line-through">
            {convertToLocale({
              amount: originalUnitPrice,
              currency_code: currencyCode,
            })}
          </p>
        </>
      ) : (
        <p
          className={twMerge(
            "text-xs sm:text-sm font-semibold",
            regularPriceClassName
          )}
        >
          {convertToLocale({ amount: unitPrice, currency_code: currencyCode })}
        </p>
      )}
    </div>
  )
}

export default LineItemUnitPrice
