import arcjet, { createMiddleware, detectBot, shield } from '@arcjet/next';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
    "/admin(.*)",
    "/saved-cars(.*)",
    "/reservations(.*)",
])

const hasArcjetKey = !!process.env.ARCJET_KEY;
const arcjetMode = process.env.ARCJET_MODE || (process.env.NODE_ENV === 'production' ? 'LIVE' : 'DRY_RUN');

const aj = hasArcjetKey
    ? arcjet({
        key: process.env.ARCJET_KEY,
        rules: [
            shield({ mode: arcjetMode }),
            detectBot({ mode: arcjetMode, allow: ["CATEGORY:SEARCH_ENGINE"] })
        ]
      })
    : null;

const clerk = clerkMiddleware(async (auth, req) => {
    const { userId, redirectToSignIn } = await auth();
    if (!userId && isProtectedRoute(req)) {
        return redirectToSignIn();
    }
    return NextResponse.next();
});

export default aj ? createMiddleware(aj, clerk) : clerk;

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};