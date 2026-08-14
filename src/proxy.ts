import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Runs on every request: refreshes the Supabase auth session cookie so
// logged-in users stay logged in, and lets us gate /admin routes.
// (Next.js 16 renamed "middleware" to "proxy" — same mechanism, new name.)
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Gate /admin behind the dedicated email/password login (not phone OTP).
  // /admin/login stays public so admins can sign in / bootstrap.
  // Role check (role=admin) happens again in the admin panel layout + RLS.
  const path = request.nextUrl.pathname;
  const isAdminLogin = path === "/admin/login" || path.startsWith("/admin/login/");
  if (path.startsWith("/admin") && !isAdminLogin && !user) {
    const redirectUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
