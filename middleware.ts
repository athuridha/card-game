import { withAuth } from "next-auth/middleware";
import type { JWT } from "next-auth/jwt";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => Boolean((token as JWT | null)?.isAdmin),
  },
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
