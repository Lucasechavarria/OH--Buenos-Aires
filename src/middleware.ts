import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Simple In-Memory Rate Limiter for Middleware (Limited by execution pod)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_THRESHOLD = 100; // peticiones
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minuto

export async function middleware(request: NextRequest) {
  const requestId = crypto.randomUUID();
  const ip = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(',')[0] || "unknown";

  // 1. Basic Rate Limiting
  const now = Date.now();
  const clientLimit = rateLimitMap.get(ip) || { count: 0, lastReset: now };

  if (now - clientLimit.lastReset > RATE_LIMIT_WINDOW) {
    clientLimit.count = 1;
    clientLimit.lastReset = now;
  } else {
    clientLimit.count++;
  }
  
  rateLimitMap.set(ip, clientLimit);

  if (clientLimit.count > RATE_LIMIT_THRESHOLD) {
    return NextResponse.json(
      { error: "Too many requests", rateLimitResetAt: clientLimit.lastReset + RATE_LIMIT_WINDOW },
      { status: 429 }
    );
  }

  // 2. Supabase Session Refresh (Zero Trust)
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // 3. RBAC Protection (Optional: Guard /admin routes)
  if (request.nextUrl.pathname.startsWith("/admin") && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Inject Request ID for Traceability
  response.headers.set("X-Request-ID", requestId);

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
