import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { adminSession } from "@/lib/supabase/admin-check";
import { stripLang } from "@/lib/i18n";

// Language routing: Vietnamese keeps unprefixed URLs and is rewritten to the app/[lang] tree as /vi/...; /en/... is
// English as is; a typed /vi/... redirects to the unprefixed URL so each page has one address.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return adminGate(request);
  if (/^\/en(\/|$)/.test(pathname)) return NextResponse.next();
  const url = request.nextUrl.clone();
  if (/^\/vi(\/|$)/.test(pathname)) {
    url.pathname = stripLang(pathname);
    return NextResponse.redirect(url, 308);
  }
  url.pathname = `/vi${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

// Gate every /admin/* route except /admin/login behind a signed-in Supabase
// session. Also refreshes the auth cookie on each request (required by
// @supabase/ssr in the App Router).
async function adminGate(request: NextRequest) {
  // No Supabase configured (e.g. production before the DB is set up) = no admin at all. Fail closed with a 404
  // instead of crashing (500) inside createServerClient.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return new NextResponse("Not found", { status: 404 });
  }
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (list) => {
          list.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  // Password-only session of an admin with 2FA set up = not in yet; the login page asks for the code.
  const { ok, step } = await adminSession(supabase);

  // Where this session belongs: anywhere (ok), only the 2FA setup page (admin without an app yet), or the login page.
  const path = request.nextUrl.pathname;
  const home = ok ? null : step === "setup" ? "/admin/2fa" : "/admin/login";
  if (home && path !== home) return redirectTo(request, home);
  if (ok && path === "/admin/login") return redirectTo(request, "/admin");

  return response;
}

function redirectTo(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  return NextResponse.redirect(url);
}

export const config = {
  // everything except Next internals, API routes and files (images, robots.txt, sitemap.xml, llms.txt, data/*.json)
  matcher: ["/((?!_next|api/|.*\\..*).*)"],
};
