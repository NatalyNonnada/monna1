"use client";
export { default } from "next-auth/middleware";

export const config = {
    matcher: ['/nonna/:path*', '/api/nonna/:path*']
}
