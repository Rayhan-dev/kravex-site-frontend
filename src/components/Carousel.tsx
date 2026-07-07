"use client"

import * as React from "react"
import { twJoin, twMerge } from "tailwind-merge"
import { EmblaCarouselType } from "embla-carousel"
import useEmblaCarousel from "embla-carousel-react"
import { Icon } from "@/components/Icon"
import { IconCircle } from "@/components/IconCircle"
import { Layout, LayoutColumn } from "@/components/Layout"

export type CarouselProps = {
  heading?: React.ReactNode
  button?: React.ReactNode
  arrows?: boolean
  autoplay?: boolean
  autoplayDelay?: number
} & React.ComponentPropsWithRef<"div">

export const Carousel: React.FC<CarouselProps> = ({
  heading,
  button,
  arrows = true,
  autoplay = false,
  autoplayDelay = 2000,
  children,
  className,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    containScroll: "trimSnaps",
    skipSnaps: true,
    active: true,
    loop: autoplay,
    duration: autoplay ? 18 : 25,
  })
  const [prevBtnDisabled, setPrevBtnDisabled] = React.useState(true)
  const [nextBtnDisabled, setNextBtnDisabled] = React.useState(true)

  const scrollPrev = React.useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  )
  const scrollNext = React.useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  )
  const onSelect = React.useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev())
    setNextBtnDisabled(!emblaApi.canScrollNext())
  }, [])

  React.useEffect(() => {
    if (!emblaApi) return

    onSelect(emblaApi)
    emblaApi.on("reInit", onSelect)
    emblaApi.on("select", onSelect)
  }, [emblaApi, onSelect])

  React.useEffect(() => {
    if (!emblaApi || !autoplay) return

    let intervalId: ReturnType<typeof setInterval> | null = null
    let resumeId: ReturnType<typeof setTimeout> | null = null
    let paused = false

    // After a manual interaction, keep this carousel paused a little longer so
    // the user's own scroll isn't immediately fought by the autoplay tick.
    const RESUME_DELAY = Math.max(autoplayDelay, 3000)

    const tick = () => {
      if (paused || !emblaApi) return
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext()
      } else {
        emblaApi.scrollTo(0)
      }
    }

    const start = () => {
      stop()
      intervalId = setInterval(tick, autoplayDelay)
    }
    const stop = () => {
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
    }

    const clearResume = () => {
      if (resumeId) {
        clearTimeout(resumeId)
        resumeId = null
      }
    }

    // Pause immediately on interaction (hover / touch / drag).
    const pause = () => {
      clearResume()
      paused = true
    }
    // Resume after a cooldown so a manual scroll interrupts only briefly.
    const resumeSoon = () => {
      clearResume()
      resumeId = setTimeout(() => {
        paused = false
      }, RESUME_DELAY)
    }

    const root = emblaApi.rootNode()
    root.addEventListener("mouseenter", pause)
    root.addEventListener("mouseleave", resumeSoon)
    emblaApi.on("pointerDown", pause)
    emblaApi.on("pointerUp", resumeSoon)

    start()

    return () => {
      stop()
      clearResume()
      root.removeEventListener("mouseenter", pause)
      root.removeEventListener("mouseleave", resumeSoon)
      emblaApi.off("pointerDown", pause)
      emblaApi.off("pointerUp", resumeSoon)
    }
  }, [emblaApi, autoplay, autoplayDelay])

  return (
    <div className={twMerge("overflow-hidden", className)}>
      <Layout>
        <LayoutColumn className="relative">
          <div className="mb-8 md:mb-15 flex max-sm:flex-col justify-between sm:items-center gap-x-10 gap-y-6">
            {heading}
            {(arrows || button) && (
              <div className="flex md:gap-6 shrink-0">
                {button}
                {arrows && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={scrollPrev}
                      disabled={prevBtnDisabled}
                      className={twJoin(
                        "max-md:hidden transition-opacity",
                        prevBtnDisabled && "opacity-50"
                      )}
                      aria-label="Previous"
                    >
                      <IconCircle>
                        <Icon
                          name="arrow-left"
                          className="w-6 h-6 text-black"
                        />
                      </IconCircle>
                    </button>
                    <button
                      type="button"
                      onClick={scrollNext}
                      disabled={nextBtnDisabled}
                      className={twJoin(
                        "max-md:hidden transition-opacity",
                        nextBtnDisabled && "opacity-50"
                      )}
                      aria-label="Next"
                    >
                      <IconCircle>
                        <Icon
                          name="arrow-right"
                          className="w-6 h-6 text-black"
                        />
                      </IconCircle>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex touch-pan-y [&>*]:mr-4 md:[&>*]:mr-10">
              {children}
            </div>
          </div>
        </LayoutColumn>
      </Layout>
    </div>
  )
}
