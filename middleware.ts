import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const cookies = request.cookies as unknown as { [key: string]: string };
    const token = cookies['access_token'] || '';
    const isLoggedIn = token !== '';

    if (isLoggedIn && pathname.startsWith('/auth/')) {
        // If the user is logged in and trying to access the auth routes, redirect to /app/home
        // return NextResponse.redirect(new URL('/app/home', request.nextUrl));
        console.log('redirecting to /app/home')
    }

    if (!isLoggedIn && pathname.startsWith('/app/')) {
        // If the user is not logged in and trying to access the app routes, redirect to /auth/login
        // return NextResponse.redirect(new URL('/auth/login', request.nextUrl));
        console.log('redirecting to /auth/login')
    }
}