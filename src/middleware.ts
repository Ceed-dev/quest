import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/**
 * i18n Middleware
 * ------------------------------------------------------------
 * - Adds/redirects locale prefixes based on the NEXT_LOCALE cookie
 *   (or Accept-Language on first visit).
 * - Skips Next.js internals, API routes, and static assets.
 * - Runs at the edge before route resolution.
 */
export default createMiddleware(routing);

/**
 * Match all paths except:
 *   - /api, /trpc, /_next, /_vercel
 *   - any path containing a dot (e.g. favicon.ico, *.png)
 *
 * NOTE: Keep this regex identical to previous behavior.
 */
export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
