import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/feedbacks/list"]; // add more if needed

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const isProtected = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  if (isProtected && !token) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Apply to all routes (optional), or customize:
export const config = {
  matcher: ["/feedbacks/list"] // only run middleware on these routes
};
