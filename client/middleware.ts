import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const publicPaths = ["auth"];
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest, res: NextResponse) {
  const isLoggedIn = !!request.cookies.get("session")?.value;

  const isPublicRoute = publicPaths.some((route) =>
    request.url.includes(route)
  );
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }
  return NextResponse.next({
    request: request,
  });
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
