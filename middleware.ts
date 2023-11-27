import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// import { cookies } from "next/headers";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath =
    path === "/auth/login" ||
    path === "/auth/register" ||
    path === "/auth/verify-mail" ||
    path === "/auth/forgot-password" ||
    path === "/auth/reset-password";

  const token = request.cookies.get("token")?.value || "";

  // const cookieStore = cookies()
  // const token = cookieStore.get('token')
  // console.log(token);

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  } else if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.nextUrl));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/auth/:path*",
    "/new",
    "/notifications",
    "/messages",
    "/profile",
    "/settings",
  ],
};
