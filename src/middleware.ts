import { NextRequest, NextResponse } from "next/server";
// import { withAuth } from "next-auth/middleware";


export async function middleware(request: NextRequest) {
    const urlPath = request.nextUrl.pathname;
    const search = request.nextUrl.search
    const cookie = request.cookies
    // console.log('middleraw');
    // console.log(cookie.get('next-auth.session-token')?.value);


    const isHasToken = (cookie.toString().includes('next-auth.session-token'));
    // console.log('urlPath', urlPath);

    // console.log(isHasToken);

    if (urlPath == '/auth/login' || urlPath == '/auth/register') {
        if (isHasToken) {

            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    if (urlPath == '/') {
        if (!isHasToken) {
            return NextResponse.redirect(new URL('/auth/login', request.url))
        }
        // if (urlPath == '/dashboard/transactions') {
        //     console.log('masuk');

        //     return NextResponse.rewrite(new URL('/dashboard/transactions/buy', request.url))
        // }
    }



}


export const config = { matcher: ['/auth/:path*', '/'] }