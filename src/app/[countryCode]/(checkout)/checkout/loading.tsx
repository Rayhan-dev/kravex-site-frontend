import { Icon } from "@/components/Icon"

export default function Loading() {
  return (
    <div className="absolute left-0 top-20 md:top-40 lg:top-0 w-full lg:max-w-[calc(100vw-((50vw-50%)+448px))] xl:max-w-[calc(100vw-((50vw-50%)+540px))] lg:-ml-[calc(50vw-50%)] h-screen flex items-center justify-center">
      <Icon name="loader" className="w-10 md:w-20 animate-spin" />
    </div>
  )
}
