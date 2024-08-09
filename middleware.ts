"use client";

import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export { default } from "next-auth/middleware";

export async function middleware(req: NextRequest) {
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!session) {
        console.log(session);
        const requestedPage = req.nextUrl.pathname;
        const url = req.nextUrl.clone();

        url.pathname = `/auth/login`;
        url.search = `p =${requestedPage}`;

        return NextResponse.redirect(url);
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/nonna/:path*', '/api/nonna/:path*']
}
