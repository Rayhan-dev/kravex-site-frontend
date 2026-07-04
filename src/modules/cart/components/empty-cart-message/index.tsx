import { LocalizedButtonLink } from "@/components/LocalizedLink"

const EmptyCartMessage = () => {
  return (
    <div>
      <div className="pb-8 md:pb-10 border-b border-black/10">
        <h1 className="md:text-2xl text-md leading-none">Your cart</h1>
      </div>
      <p className="text-black/50 text-sm mt-6 mb-8 max-w-xs">
        Nothing here yet. Browse the collection and add something worth owning.
      </p>
      <LocalizedButtonLink href="/store" variant="outline">
        Browse the store
      </LocalizedButtonLink>
    </div>
  )
}

export default EmptyCartMessage
