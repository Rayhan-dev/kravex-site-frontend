"use client"

import { useParams, usePathname } from "next/navigation"
import { twMerge } from "tailwind-merge"
import { Layout, LayoutColumn } from "@/components/Layout"
import { LocalizedLink } from "@/components/LocalizedLink"

export const Footer: React.FC = () => {
  const pathName = usePathname()
  const { countryCode } = useParams()
  const currentPath = pathName.split(`/${countryCode}`)[1]

  const isAuthPage = currentPath === "/register" || currentPath === "/login"

  return (
    <footer
      className={twMerge(
        "bg-black text-cream mt-20 md:mt-32",
        isAuthPage && "hidden"
      )}
    >
      <Layout>
        <LayoutColumn className="col-span-13">
          <div className="py-16 md:py-24 flex max-lg:flex-col justify-between gap-12 md:gap-20">
            <div>
              <p className="font-bebas text-[3rem] md:text-[4rem] tracking-[0.02em] leading-none mb-4">
                Kravex
              </p>
              <p className="text-sm text-cream/60 max-w-sm">
                Bangladesh&apos;s premier destination for anime and game
                katanas. We treat blades as fine art — curated, precise,
                delivered to your door.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-10 md:gap-24">
              <div className="flex flex-col gap-4">
                <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-cream/40">
                  Navigation
                </p>
                <LocalizedLink href="/store" className="text-[11px] tracking-[0.15em] uppercase text-cream/80 hover:text-cream">
                  Shop All
                </LocalizedLink>
                <LocalizedLink href="/cart" className="text-[11px] tracking-[0.15em] uppercase text-cream/80 hover:text-cream">
                  Cart
                </LocalizedLink>
                <LocalizedLink href="/account" className="text-[11px] tracking-[0.15em] uppercase text-cream/80 hover:text-cream">
                  Account
                </LocalizedLink>
              </div>
              <div className="flex flex-col gap-4">
                <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-cream/40">
                  Connect
                </p>
                <a href="https://www.instagram.com/kravex_collectibles/" target="_blank" rel="noreferrer" className="text-[11px] tracking-[0.15em] uppercase text-cream/80 hover:text-cream">
                  Instagram
                </a>
                <a href="https://www.facebook.com/profile.php?id=61591535542705" target="_blank" rel="noreferrer" className="text-[11px] tracking-[0.15em] uppercase text-cream/80 hover:text-cream">
                  Facebook
                </a>
              </div>
            </div>
          </div>
          <div className="py-6 border-t border-cream/15 flex max-sm:flex-col justify-between gap-2">
            <p className="text-[11px] tracking-[0.1em] uppercase text-cream/50">
              &copy; {new Date().getFullYear()} Kravex. All rights reserved.
            </p>
            <p className="text-[11px] tracking-[0.1em] uppercase text-cream/50">
              Beyond the blade
            </p>
          </div>
        </LayoutColumn>
      </Layout>
    </footer>
  )
}
