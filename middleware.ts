// Middleware for Request ID and Logging
// app/middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Generate a unique Request ID (UUID v4)
  const requestId = crypto.randomUUID();

  // Add the request ID to the headers
  const response = NextResponse.next();
  response.headers.set("X-Request-ID", requestId);

  // Structured Logging (JSON)
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level: "INFO",
    requestId,
    method: request.method,
    url: request.url,
    userAgent: request.headers.get("user-agent")
  }));

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
