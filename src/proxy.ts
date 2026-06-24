import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "stats_auth";

export function proxy(req: NextRequest) {
  const expected = process.env.STATS_PASSWORD;
  if (!expected) return NextResponse.next();

  if (req.nextUrl.pathname === "/stats/login") return NextResponse.next();

  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  if (cookie === expected) return NextResponse.next();

  const loginUrl = new URL("/stats/login", req.url);
  loginUrl.searchParams.set("next", req.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/stats", "/stats/:path*"],
};
