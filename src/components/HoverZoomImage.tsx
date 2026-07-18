"use client"

import * as React from "react"
import Image from "next/image"

type HoverZoomImageProps = {
  src: string
  alt: string
  priority?: boolean
  sizes?: string
  /** How much to magnify. */
  zoom?: number
}

// Distance (px) a touch can move and still count as a tap rather than a drag.
const TAP_MOVE_THRESHOLD = 10

export const HoverZoomImage: React.FC<HoverZoomImageProps> = ({
  src,
  alt,
  priority,
  sizes,
  zoom = 2,
}) => {
  const [origin, setOrigin] = React.useState("50% 50%")
  // Desktop: a click toggles a sticky zoom, then moving the mouse pans.
  const [isClickZoomed, setIsClickZoomed] = React.useState(false)
  // Touch: tap toggles a sticky zoom, then drag pans.
  const [isTapZoomed, setIsTapZoomed] = React.useState(false)
  const touchStart = React.useRef<{ x: number; y: number } | null>(null)
  // A tap fires a synthetic click after touchend; this flag lets us ignore it
  // so touch doesn't toggle both isTapZoomed and isClickZoomed.
  const suppressClick = React.useRef(false)

  const setOriginFromPoint = React.useCallback(
    (clientX: number, clientY: number, el: HTMLElement) => {
      const rect = el.getBoundingClientRect()
      const x = ((clientX - rect.left) / rect.width) * 100
      const y = ((clientY - rect.top) / rect.height) * 100
      setOrigin(
        `${Math.max(0, Math.min(100, x))}% ${Math.max(0, Math.min(100, y))}%`
      )
    },
    []
  )

  const handleMouseMove = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      // Only pan while zoomed; otherwise the origin is irrelevant until a click.
      if (!isClickZoomed) return
      setOriginFromPoint(event.clientX, event.clientY, event.currentTarget)
    },
    [isClickZoomed, setOriginFromPoint]
  )

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      // Ignore the synthetic click that follows a touch tap.
      if (suppressClick.current) {
        suppressClick.current = false
        return
      }
      // Zoom in at the clicked point; a second click zooms back out.
      if (!isClickZoomed) {
        setOriginFromPoint(event.clientX, event.clientY, event.currentTarget)
      }
      setIsClickZoomed((prev) => !prev)
    },
    [isClickZoomed, setOriginFromPoint]
  )

  const handleTouchStart = React.useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      const touch = event.touches[0]
      touchStart.current = { x: touch.clientX, y: touch.clientY }
      // While zoomed, keep the touch from reaching Embla so panning the image
      // doesn't get interpreted as a swipe to the next slide.
      if (isTapZoomed) {
        event.stopPropagation()
        setOriginFromPoint(touch.clientX, touch.clientY, event.currentTarget)
      }
    },
    [isTapZoomed, setOriginFromPoint]
  )

  const handleTouchMove = React.useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      if (!isTapZoomed) return
      event.stopPropagation()
      const touch = event.touches[0]
      setOriginFromPoint(touch.clientX, touch.clientY, event.currentTarget)
    },
    [isTapZoomed, setOriginFromPoint]
  )

  const handleTouchEnd = React.useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      const start = touchStart.current
      touchStart.current = null
      if (!start) return
      const touch = event.changedTouches[0]
      const moved =
        Math.abs(touch.clientX - start.x) > TAP_MOVE_THRESHOLD ||
        Math.abs(touch.clientY - start.y) > TAP_MOVE_THRESHOLD
      // A tap (not a drag/swipe) toggles the zoom at the tapped point.
      if (!moved) {
        // Swallow the synthetic click that follows this tap.
        suppressClick.current = true
        if (!isTapZoomed) {
          setOriginFromPoint(touch.clientX, touch.clientY, event.currentTarget)
        }
        setIsTapZoomed((prev) => !prev)
      }
    },
    [isTapZoomed, setOriginFromPoint]
  )

  const isZoomed = isClickZoomed || isTapZoomed

  return (
    // overflow-hidden keeps the magnified image clipped inside this box, so it
    // never covers the carousel's left/right nav buttons. No elevated z-index
    // here, so those buttons (z-10) stay on top and clickable.
    <div
      className={
        "relative aspect-square w-full overflow-hidden " +
        (isZoomed ? "cursor-zoom-out" : "cursor-zoom-in")
      }
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      // When zoomed on touch, disable native scrolling so a drag pans the image
      // instead of scrolling the page.
      style={{ touchAction: isTapZoomed ? "none" : undefined }}
    >
      <Image
        src={src}
        alt={alt}
        priority={priority}
        fill
        sizes={sizes}
        draggable={false}
        className="object-cover transition-transform duration-200 ease-out will-change-transform"
        style={{
          transformOrigin: origin,
          transform: isZoomed ? `scale(${zoom})` : "scale(1)",
        }}
      />
    </div>
  )
}
