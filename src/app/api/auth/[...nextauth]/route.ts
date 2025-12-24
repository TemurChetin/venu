import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { instance } from "@/services/api/instance";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Phone",
      credentials: {
        phone: { label: "Phone", type: "text" },
        token: { label: "Token", type: "text" }, // JWT token from verify-otp
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.token) {
          return null;
        }

        try {
          // JWT token is already verified by verify-otp API
          // We just need to extract user info or verify token with backend
          // For now, we'll use the token directly and decode it if needed
          // In a real scenario, you might want to call a "me" endpoint to get user info

          // Decode JWT to get user ID (basic decode without verification)
          let userId = "";
          try {
            const base64Url = credentials.token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(
              atob(base64)
                .split("")
                .map(
                  (c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                )
                .join("")
            );
            const decoded = JSON.parse(jsonPayload);
            userId = decoded.sub?.toString() || "";
          } catch (e) {
            console.error("Error decoding token:", e);
          }

          return {
            id: userId || credentials.phone,
            phone: credentials.phone,
            accessToken: credentials.token,
          };
        } catch (error: any) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.phone = (user as any).phone;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session as any).accessToken = token.accessToken;
        (session as any).phone = token.phone;
        (session as any).user.id = token.id;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
