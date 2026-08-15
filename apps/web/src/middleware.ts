import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Protect all routes except the marketing pages, login/register, and api routes that might be public
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)', 
  '/settings(.*)', 
  '/diagnose(.*)', 
  '/market(.*)', 
  '/schedule(.*)', 
  '/community(.*)', 
  '/finance(.*)', 
  '/schemes(.*)', 
  '/topography(.*)',
  '/trace(.*)',
  '/agent(.*)',
  '/soil-health(.*)'
])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    // Restrict access
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
