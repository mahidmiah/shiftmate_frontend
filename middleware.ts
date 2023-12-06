import { useRouter } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest, response: NextResponse) {
    const { pathname } = request.nextUrl;
    const cookies = request.cookies as unknown as { [key: string]: string };
    const token = cookies['access_token'] || '';
    const isLoggedIn = token !== '';

    console.log('middleware.ts: pathname: ', pathname)
    console.log('middleware.ts: cookies: ', cookies)
    console.log('middleware.ts: token: ', token)
    console.log('middleware.ts: isLoggedIn: ', isLoggedIn)
    console.log('middleware.ts: request: ', request)
    console.log('middleware.ts: response: ', response)
    console.log('middleware.ts: request.nextUrl: ', request.nextUrl)
    console.log('middleware.ts: request.nextUrl.pathname: ', request.nextUrl.pathname)
    console.log('---------------------------------------------------------------------------')

    // if (isLoggedIn && pathname.startsWith('/auth/')) {
    //     // If the user is logged in and trying to access the auth routes, redirect to /app/home
    //     return NextResponse.redirect(new URL('/app/home', request.nextUrl));
    //     // console.log('redirecting to /app/home')
    // }

    // if (!isLoggedIn && pathname.startsWith('/app/')) {
    //     // If the user is not logged in and trying to access the app routes, redirect to /auth/login
    //     return NextResponse.redirect(new URL('/auth/login', request.nextUrl));
    //     // console.log('redirecting to /auth/login')
    // }
}
