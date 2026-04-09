import { clerkMiddleware } from '@clerk/nextjs/server';

// This forces the full Node.js environment, supporting #crypto and Clerk internals
export const runtime = 'nodejs';

// Next.js 16 expects the function to be named 'proxy'
export default function proxy(request) {
  return clerkMiddleware()(request);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};