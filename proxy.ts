import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Renamed from `middleware.ts` per Next.js 16 (the `middleware` file
// convention is deprecated). next-intl's handler is a standard request
// proxy, so it works unchanged under the `proxy` file convention.
export default createMiddleware(routing);

export const config = {
  // Run on every path except:
  //  - /api routes (do their own locale handling via headers)
  //  - Next.js internals (_next/*)
  //  - Static asset requests (anything with a file extension)
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
