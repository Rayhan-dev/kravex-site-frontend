import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCustomer } from "@lib/data/customer"
import { SignUpForm } from "@modules/auth/components/SignUpForm"
import { LocalizedLink } from "@/components/LocalizedLink"

export const metadata: Metadata = {
  title: "Register",
  description: "Create an account",
}

function DragonPanel() {
  return (
    <div
      className="max-lg:hidden lg:w-1/2 shrink-0 relative overflow-hidden flex flex-col items-start justify-end p-16"
      style={{ backgroundColor: "#ede8d0" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg,transparent,transparent 38px,rgba(0,0,0,0.033) 38px,rgba(0,0,0,0.033) 39px)",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <svg viewBox="0 0 200 210" fill="currentColor" className="w-[85%] text-black" style={{ opacity: 0.07 }}>
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
      </div>
      <div className="relative z-10">
        <div className="w-20 h-px bg-black mb-4" />
        <p className="font-bebas text-[5rem] leading-none text-black mb-3" style={{ letterSpacing: "0.02em" }}>KRAVEX</p>
        <p className="text-xs text-black/45 tracking-[0.2em] uppercase">Anime &bull; Katanas &bull; Collectibles</p>
      </div>
    </div>
  )
}

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const customer = await getCustomer().catch(() => null)

  if (customer) {
    redirect(`/${(await params).countryCode}/account`)
  }

  return (
    <div className="flex min-h-screen">
      <DragonPanel />
      <div className="shrink-0 max-w-100 lg:max-w-96 w-full mx-auto pt-30 lg:pt-37 pb-16 max-sm:px-4">
        <h1
          className="font-bebas leading-none mb-10 md:mb-14"
          style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "0.02em" }}
        >
          Create Account
        </h1>
        <SignUpForm />
        <p className="text-grayscale-500">
          Already have an account? No worries, just{" "}
          <LocalizedLink href="/auth/login" variant="underline" className="text-black md:pb-0.5">
            log in
          </LocalizedLink>
          .
        </p>
      </div>
    </div>
  )
}
