import * as React from "react"
import { twMerge } from "tailwind-merge"

export const IconCircle: React.FC<React.ComponentPropsWithRef<"div">> = ({
  className,
  ...rest
}) => (
  <div
    {...rest}
    className={twMerge(
      "inline-flex h-10 w-10 items-center justify-center rounded-none border border-black transition-colors hover:bg-black hover:text-cream",
      className
    )}
  />
)
