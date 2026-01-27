import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin",
      credentials: {
        identifier: { label: "Username atau Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const identifier = credentials?.identifier?.trim() ?? "";
        const password = credentials?.password ?? "";

        if (!identifier || !password) return null;

        const admin = await prisma.adminUser.findFirst({
          where: {
            OR: [
              { username: { equals: identifier, mode: "insensitive" } },
              { email: { equals: identifier, mode: "insensitive" } },
            ],
          },
        });

        if (!admin) return null;
        const ok = await bcrypt.compare(password, admin.passwordHash);
        if (!ok) return null;

        return {
          id: admin.id,
          name: admin.username,
          email: admin.email ?? undefined,
          isAdmin: true,
        };
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as unknown as { isAdmin?: boolean };
        token.isAdmin = Boolean(u.isAdmin);
        if (user.email) token.email = user.email;
        if (user.name) token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      session.isAdmin = Boolean(token.isAdmin);
      if (session.user) session.user.isAdmin = Boolean(token.isAdmin);
      return session;
    },
  },
};
