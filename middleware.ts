import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Protect /admin routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const roleHeader = request.headers.get("x-user-role");
    const roleCookie = request.cookies.get("user-role")?.value;
    const role = roleHeader || roleCookie;

    // Allow dev bypass or valid superadmin role
    if (role && role !== "superadmin") {
      return NextResponse.json(
        { success: false, error: "Akses ditolak: Hanya Super Admin yang diizinkan" },
        { status: 403 }
      );
    }
  }

  // Only invoke Supabase auth session update on protected routes or when auth cookies exist
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/admin") ||
    pathname.startsWith("/bookings");

  const hasAuthCookie = request.cookies
    .getAll()
    .some((c) => c.name.startsWith("sb-") || c.name === "user-role");

  if (isProtectedRoute || hasAuthCookie) {
    try {
      return await updateSession(request);
    } catch (error) {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
