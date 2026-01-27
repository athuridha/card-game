import "next-auth";

declare module "next-auth" {
  interface Session {
    isAdmin?: boolean;
    user?: {
      isAdmin?: boolean;
    } & NonNullable<Session["user"]>;
  }

  interface User {
    isAdmin?: boolean;
  }
}
