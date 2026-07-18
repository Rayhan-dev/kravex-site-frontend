import { HttpTypes } from "@medusajs/types"

import Item from "@modules/cart/components/item"

type ItemsTemplateProps = {
  items?: HttpTypes.StoreCartLineItem[]
  currencyCode: string
}

const ItemsTemplate = ({ items, currencyCode }: ItemsTemplateProps) => {
  return (
    <div>
      <div className="pb-8 md:pb-10 border-b border-black/10">
        <h1 className="md:text-2xl text-md leading-none">Your cart</h1>
      </div>
      <div>
        {items
          ? [...items]
              .sort((a, b) => {
                // Newest first; copy before sorting (never mutate the source
                // array) and tie-break on id for a stable order across renders.
                const at = (v?: Date | string | null) =>
                  v ? new Date(v).getTime() : 0
                const byDate = at(b.created_at) - at(a.created_at)
                return byDate !== 0 ? byDate : a.id.localeCompare(b.id)
              })
              .map((item) => {
                return (
                  <Item key={item.id} item={item} currencyCode={currencyCode} />
                )
              })
          : null}
      </div>
    </div>
  )
}

export default ItemsTemplate
