import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('access_token')?.value || '';
    const isLoggedIn = token !== '';

    if (isLoggedIn && pathname.startsWith('/auth/')) {
        // If the user is not logged in and trying to access the default / route, redirect to /auth/login
        return NextResponse.redirect(new URL('/app/home', request.nextUrl));
    }

    if (!isLoggedIn && pathname.startsWith('/app/')) {
        // If the user is not logged in and trying to access the default / route, redirect to /auth/login
        return NextResponse.redirect(new URL('/auth/login', request.nextUrl));
    }
}