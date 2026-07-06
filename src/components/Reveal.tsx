"use client"

import * as React from "react"
import { twMerge } from "tailwind-merge"

type RevealProps = {
  children: React.ReactNode
  className?: string
  /** Stagger delay in seconds (applied via CSS transition-delay). */
  delay?: number
  /** Render as a different element (defaults to div). */
  as?: keyof React.JSX.IntrinsicElements
}

/**
 * Scroll-reveal wrapper. Adds `.is-visible` once the element enters the
 * viewport, triggering the snappy fade-up defined in globals.css (.kx-reveal).
 * Reveals once and then disconnects — no re-hiding on scroll up.
 */
export const Reveal: React.FC<RevealProps> = ({
  children,
  className,
  delay = 0,
  as = "div",
}) => {
  const ref = React.useRef<HTMLElement>(null)
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return

    // If IntersectionObserver is unavailable, show immediately.
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.disconnect()
            break
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const Tag = as as React.ElementType

  return (
    <Tag
      ref={ref}
      className={twMerge("kx-reveal", visible && "is-visible", className)}
      style={delay ? { ["--kx-delay" as string]: `${delay}s` } : undefined}
    >
      {children}
    </Tag>
  )
}

export default Reveal
