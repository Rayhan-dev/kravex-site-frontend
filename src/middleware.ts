import { NextRequest, NextResponse } from "next/server"

const COUNTRY_CODE = process.env.NEXT_PUBLIC_DEFAULT_REGION || "bd"

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const firstSegment = pathname.split("/")[1]?.toLowerCase()

  if (firstSegment === COUNTRY_CODE) {
    return NextResponse.next()
  }

  const redirectPath = pathname === "/" ? "" : pathname
  const queryString = request.nextUrl.search ?? ""
  const redirectUrl = `${request.nextUrl.origin}/${COUNTRY_CODE}${redirectPath}${queryString}`

  return NextResponse.redirect(redirectUrl, 307)
}

export const config = {
  matcher: [
    "/((?!api|_next/static|favicon.ico|_next/image|images|robots.txt).*)",
  ],
}
