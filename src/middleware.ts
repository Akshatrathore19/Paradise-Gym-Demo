import { NextResponse } from "next/server"
import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

const { auth } = NextAuth(authConfig)

const protectedAdminRoutes = ["/admin"]
const protectedMemberRoutes = ["/dashboard"]
const authRoutes = ["/login", "/register"]

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const userRole = req.auth?.user?.role
  
  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
  if (isApiAuthRoute) {
    return NextResponse.next()
  }

  const isAuthRoute = authRoutes.some((route) => nextUrl.pathname.startsWith(route))
  
  if (isAuthRoute) {
    if (isLoggedIn) {
      if (userRole === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", nextUrl))
      }
      return NextResponse.redirect(new URL("/dashboard", nextUrl))
    }
    return NextResponse.next()
  }

  const isAdminRoute = protectedAdminRoutes.some((route) => nextUrl.pathname.startsWith(route))
  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl))
    }
    if (userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl))
    }
    return NextResponse.next()
  }

  const isMemberRoute = protectedMemberRoutes.some((route) => nextUrl.pathname.startsWith(route))
  if (isMemberRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
