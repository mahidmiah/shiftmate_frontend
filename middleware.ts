import { ro } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest, response: NextResponse, next: () => void) {
    const router = useRouter()
    const { pathname } = request.nextUrl;
    const cookies = request.cookies as unknown as { [key: string]: string };
    const token = cookies['access_token'] || '';
    const isLoggedIn = token !== '';

    if (isLoggedIn && pathname.startsWith('/auth/')) {
        // If the user is logged in and trying to access the auth routes, redirect to /app/home
        router.push('/app/home')
        // console.log('redirecting to /app/home')
        next()
    }

    if (!isLoggedIn && pathname.startsWith('/app/')) {
        // If the user is not logged in and trying to access the app routes, redirect to /auth/login
        router.push('/auth/login')
        // console.log('redirecting to /auth/login')
        next()
    }
}