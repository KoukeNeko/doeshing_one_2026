import { PrismaAdapter } from "@auth/prisma-adapter";
import { type NextAuthOptions } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // 只允許特定的 email 登入（管理員）
      const allowedEmail = process.env.ADMIN_EMAIL;
      
      // 記錄登入嘗試（用於除錯）
      console.log('=== SignIn Attempt ===');
      console.log('User email:', user.email);
      console.log('Allowed email:', allowedEmail);
      console.log('Match:', user.email?.toLowerCase() === allowedEmail?.toLowerCase());
      
      // 使用不區分大小寫的比對
      if (user.email && allowedEmail && 
          user.email.toLowerCase() === allowedEmail.toLowerCase()) {
        console.log('✅ Access granted');
        return true;
      }
      
      console.log('❌ Access denied');
      return false; // 拒絕其他用戶
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};
