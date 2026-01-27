import { withAuth } from "next-auth/middleware";
import type { JWT } from "next-auth/jwt";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const pathname = req.nextUrl.pathname;
      // Allow access to the admin login page itself, otherwise we'd redirect-loop.
      if (pathname.startsWith("/admin/login")) return true;

      return Boolean((token as JWT | null)?.isAdmin);
    },
  },
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
