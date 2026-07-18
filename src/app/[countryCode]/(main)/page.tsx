import { Metadata } from "next"
import { getRegion } from "@lib/data/regions"
import { getProductTypesList } from "@lib/data/product-types"
import { getProductsList } from "@lib/data/products"
import { LocalizedLink } from "@/components/LocalizedLink"
import { CollectionsSlider } from "@modules/store/components/collections-slider"
import { OurProducts } from "@/components/OurProducts"
import { RecentlyAddedProducts } from "@/components/RecentlyAddedProducts"
import { Reveal } from "@/components/Reveal"

export const metadata: Metadata = {
  // `absolute` bypasses the "%s | Kravex" root template so the brand name
  // isn't duplicated, and puts the target keywords first (highest weight).
  title: {
    absolute:
      "Katana Shop BD | Anime Katana & Sword Shop in Bangladesh — Kravex",
  },
  description:
    "Kravex is Bangladesh's online katana & anime shop. Buy anime and game katanas, swords and knives — Demon Slayer, One Piece, Bleach, Naruto & Valorant blades — delivered nationwide across BD.",
  keywords: [
    "katana shop bd",
    "anime shop bd",
    "katana shop bangladesh",
    "anime shop bangladesh",
    "buy katana bd",
    "katana price in bangladesh",
    "anime katana bd",
    "sword shop bd",
    "anime sword shop bangladesh",
    "katana bd",
    "Zoro sword Bangladesh",
    "Demon Slayer katana",
    "One Piece katana",
    "Valorant knife replica",
    "Kravex Collectibles",
  ],
}

function DragonSVG({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 210"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M95 92 C75 78 48 58 22 36 C31 53 40 67 33 82 C22 85 14 95 21 103 C41 96 63 94 79 99 C85 94 91 92 95 92Z" />
      <path d="M105 92 C125 78 152 58 178 36 C169 53 160 67 167 82 C178 85 186 95 179 103 C159 96 137 94 121 99 C115 94 109 92 105 92Z" />
      <path d="M90 90 C87 108 87 130 90 148 C93 152 107 152 110 148 C113 130 113 108 110 90Z" />
      <path d="M91 92 C89 78 90 66 96 58 C98 55 102 55 104 58 C110 66 111 78 109 92Z" />
      <path d="M86 72 C83 60 87 49 97 46 C105 44 114 50 114 60 C114 71 109 77 102 78 C95 79 87 77 86 72Z" />
      <path d="M84 67 C78 62 75 53 82 48 L97 47 C91 52 89 60 92 67Z" />
      <circle cx="104" cy="61" r="3" fill="white" />
      <circle cx="104" cy="61" r="1.5" />
      <path d="M91 52 L83 30 L98 50Z" />
      <path d="M109 52 L117 30 L102 50Z" />
      <path d="M100 150 C89 163 86 176 93 186 C97 191 103 191 107 186 C114 176 111 163 100 150Z" />
      <path d="M90 122 C80 130 71 138 65 147 L72 145 C75 139 83 132 89 126Z" />
      <path d="M65 147 L58 155 L66 152 L63 159 L70 152 L72 145Z" />
      <path d="M110 122 C120 130 129 138 135 147 L128 145 C125 139 117 132 111 126Z" />
      <path d="M135 147 L142 155 L134 152 L137 159 L130 152 L128 145Z" />
    </svg>
  )
}

const CARDS = [
  {
    id: "ds",
    series: "Demon Slayer",
    name: "Nichirin Blade",
    desc: "Tanjiro, Rengoku, Shinobu & more",
    rotate: "-4deg",
    tx: "-6px",
    ty: "-10px",
    delay: "0.1s",
  },
  {
    id: "op",
    series: "One Piece",
    name: "Meito Series",
    desc: "Roronoa Zoro, Trafalgar D. law",
    rotate: "3deg",
    tx: "6px",
    ty: "6px",
    delay: "0.22s",
  },
  {
    id: "bl",
    series: "Bleach",
    name: "Zanpakuto Series",
    desc: "Ichigo,Rukia & More ",
    rotate: "4deg",
    tx: "16px",
    ty: "-4px",
    delay: "0.36s",
  },
  {
    id: "vl",
    series: "Valorant",
    name: "Melee & knife",
    desc: "Karambit, Butterfly, Sword & More",
    rotate: "-2deg",
    tx: "-10px",
    ty: "10px",
    delay: "0.5s",
  },
]

const RecentlyAddedSection: React.FC<{ countryCode: string }> = async ({
  countryCode,
}) => {
  const {
    response: { products },
  } = await getProductsList({
    queryParams: { limit: 20, order: "-created_at" },
    countryCode,
  })

  if (!products.length) {
    return null
  }

  return (
    <RecentlyAddedProducts
      products={products}
      className="mt-22 md:mt-36 mb-22 md:mb-36"
    />
  )
}

const ProductTypesSection: React.FC<{ countryCode: string }> = async ({
  countryCode,
}) => {
  const productTypes = await getProductTypesList(0, 20, ["id", "value"])
  if (!productTypes) return null

  const groups = await Promise.all(
    productTypes.productTypes.map(async (productType) => {
      const {
        response: { products },
      } = await getProductsList({
        queryParams: { limit: 12, type_id: [productType.id] },
        countryCode,
      })

      return {
        id: productType.id,
        value: productType.value,
        products,
      }
    })
  )

  const groupsWithProducts = groups.filter((group) => group.products.length > 0)

  if (!groupsWithProducts.length) {
    return null
  }

  return <OurProducts groups={groupsWithProducts} />
}

export default async function Home({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  const region = await getRegion(countryCode)
  if (!region) return null

  return (
    <>
      <style>{`
        @keyframes kx-breathe {
          0%,100%{transform:scale(1) rotate(0deg);}
          50%    {transform:scale(1.07) rotate(1.5deg);}
        }
        @keyframes kx-float {
          0%,100%{transform:translateY(0);}
          50%    {transform:translateY(-10px);}
        }
        @keyframes kx-wm-float {
          0%,100%{transform:translateY(0) scale(1.5);}
          50%    {transform:translateY(-14px) scale(1.5);}
        }
        @keyframes kx-card-in {
          from{opacity:0;translate:0 20px;}
          to  {opacity:1;translate:0 0;}
        }
        .kx-dragon-logo{animation:kx-breathe 3.2s ease-in-out infinite,kx-float 4.5s ease-in-out infinite;}
        .kx-dragon-wm  {animation:kx-wm-float 6s ease-in-out infinite;}
        .kx-card{
          animation:kx-card-in 0.55s ease both;
          transition:translate 0.2s ease,border-color 0.2s ease;
        }
        .kx-card:hover{translate:0 -5px;border-color:rgba(0,0,0,0.3);}
        .kx-diag{background-image:repeating-linear-gradient(-45deg,transparent,transparent 38px,rgba(0,0,0,0.033) 38px,rgba(0,0,0,0.033) 39px);}
        .kx-btn{transition:background-color 0.18s ease,letter-spacing 0.18s ease;}
        .kx-btn:hover{background-color:rgba(5,5,5,0.8);letter-spacing:0.22em;}
      `}</style>

      {/* HERO */}
      <section
        className="relative overflow-hidden min-h-screen flex items-center pt-18"
        style={{ backgroundColor: "#ede8d0" }}
      >
        <div className="kx-diag absolute inset-0 pointer-events-none" />
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 flex flex-col lg:flex-row items-center gap-16 lg:gap-8 py-20 lg:py-28">
          {/* LEFT */}
          <div className="flex-1 flex flex-col items-start">
            <div className="kx-dragon-logo w-14 h-14 lg:w-20 lg:h-20 mb-6 text-black">
              <DragonSVG className="w-full h-full" />
            </div>
            <div className="w-20 h-px bg-black mb-6" />
            <h1
              className="font-bebas leading-none text-black mb-4"
              style={{
                fontSize: "clamp(5rem,14vw,10rem)",
                letterSpacing: "0.02em",
              }}
            >
              KRAVEX
            </h1>
            <p className="text-sm font-medium text-black mb-2 leading-snug max-w-xs">
              Anime Katanas and Swords.
            </p>
            <p
              className="text-xs mb-10 tracking-[0.25em] uppercase"
              style={{ color: "rgba(0,0,0,0.40)" }}
            >
              Katanas&nbsp;&bull;&nbsp;Character&nbsp;Knives&nbsp;&bull;&nbsp;Accessories
            </p>
            <LocalizedLink
              href="/store"
              className="kx-btn inline-block bg-black px-8 py-4 text-xs font-semibold tracking-[0.2em] uppercase"
              style={{ color: "#ede8d0" }}
            >
              Shop Now
            </LocalizedLink>
          </div>

          {/* RIGHT */}
          <div className="flex-1 relative w-full">
            <div
              className="kx-dragon-wm absolute inset-0 flex items-center justify-center pointer-events-none select-none"
              aria-hidden="true"
              style={{ opacity: 0.055 }}
            >
              <DragonSVG className="w-[160%] h-[160%] text-black" />
            </div>
            <div className="relative grid grid-cols-2 gap-3 lg:gap-4 p-2 lg:p-6">
              {CARDS.map((card) => (
                <LocalizedLink
                  key={card.id}
                  href="/store"
                  className="kx-card block p-4 lg:p-5 border border-black/10 bg-[#ede8d0]"
                  style={{
                    transform: `rotate(${card.rotate}) translate(${card.tx},${card.ty})`,
                    animationDelay: card.delay,
                  }}
                >
                  <div className="h-14 lg:h-20 flex items-center justify-center mb-3 lg:mb-4">
                    <svg
                      viewBox="0 0 144 34"
                      className="w-full max-w-[110px] lg:max-w-[138px]"
                      fill="none"
                    >
                      <path
                        d="M20 14 L132 5 L137 12 L132 19 L20 20Z"
                        fill="currentColor"
                        opacity="0.75"
                      />
                      <ellipse
                        cx="20"
                        cy="17"
                        rx="5"
                        ry="11"
                        fill="currentColor"
                      />
                      <rect
                        x="2"
                        y="12"
                        width="20"
                        height="10"
                        rx="0"
                        fill="currentColor"
                        opacity="0.5"
                      />
                      <line
                        x1="8"
                        y1="12"
                        x2="8"
                        y2="22"
                        stroke="#ede8d0"
                        strokeWidth="1"
                        opacity="0.5"
                      />
                      <line
                        x1="14"
                        y1="12"
                        x2="14"
                        y2="22"
                        stroke="#ede8d0"
                        strokeWidth="1"
                        opacity="0.5"
                      />
                      <path
                        d="M32 8 L132 5 L132 8 L32 11Z"
                        fill="#ede8d0"
                        opacity="0.25"
                      />
                    </svg>
                  </div>
                  <p className="text-2xs lg:text-xs font-semibold uppercase tracking-[0.2em] mb-1 text-black/40">
                    {card.series}
                  </p>
                  <p className="text-xs lg:text-sm font-semibold text-black leading-tight mb-1">
                    {card.name}
                  </p>
                  <p className="text-2xs lg:text-xs leading-snug text-black/35">
                    {card.desc}
                  </p>
                </LocalizedLink>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BELOW HERO */}
      <div className="pt-4 pb-14 md:pt-12 md:pb-20">
        <Reveal>
          <CollectionsSlider className="mb-22 md:mb-36" />
        </Reveal>
        <ProductTypesSection countryCode={countryCode} />
        <RecentlyAddedSection countryCode={countryCode} />
      </div>

      {/* SEO CONTENT — crawlable copy targeting local search intent.
          Kept out of the hero, styled on-brand (cream / bebas headings). */}
      <section
        aria-label="About Kravex"
        className="border-t border-black/10"
        style={{ backgroundColor: "#ede8d0" }}
      >
        <div className="max-w-[1000px] mx-auto px-6 py-16 md:py-24">
          <h2
            className="font-bebas leading-none text-black mb-6"
            style={{ fontSize: "clamp(2.5rem,6vw,4rem)", letterSpacing: "0.02em" }}
          >
            Katana Shop in Bangladesh
          </h2>
          <p className="text-sm md:text-base leading-relaxed text-black/70 mb-5 max-w-3xl">
            Kravex is Bangladesh&apos;s home-grown <strong>anime and game
            katana shop</strong> — a dedicated <strong>katana shop in BD</strong>{" "}
            for collectors and enthusiasts. From Demon Slayer Nichirin blades and
            One Piece Meito swords to Bleach Zanpakuto katanas and Valorant
            melee knives, every replica is hand-picked and priced for fans across
            Bangladesh. Order online and we deliver nationwide — Dhaka,
            Chittagong, Sylhet and beyond.
          </p>

          <h2
            className="font-bebas leading-none text-black mt-12 mb-6"
            style={{ fontSize: "clamp(2.5rem,6vw,4rem)", letterSpacing: "0.02em" }}
          >
            Anime Shop BD — Swords, Katanas &amp; Collectibles
          </h2>
          <p className="text-sm md:text-base leading-relaxed text-black/70 mb-5 max-w-3xl">
            Looking for an <strong>anime shop in Bangladesh</strong>? Kravex
            brings your favourite series to life with wooden, luminous and metal
            blades. Whether you want to <strong>buy a katana in BD</strong>,
            compare <strong>katana prices in Bangladesh</strong>, or find a
            character knife from Valorant, our{" "}
            <LocalizedLink
              href="/store"
              className="underline underline-offset-4 hover:text-black"
            >
              full katana &amp; sword collection
            </LocalizedLink>{" "}
            is a click away. Fast delivery, secure checkout and dedicated support
            across Bangladesh.
          </p>

          <LocalizedLink
            href="/store"
            className="kx-btn inline-block bg-black px-8 py-4 mt-4 text-xs font-semibold tracking-[0.2em] uppercase"
            style={{ color: "#ede8d0" }}
          >
            Shop All Katanas
          </LocalizedLink>
        </div>
      </section>
    </>
  )
}
