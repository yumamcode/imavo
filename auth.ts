import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { getUser } from "./app/lib/users";
import { SupabaseAdapter } from "@auth/supabase-adapter";

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  }),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // next-authのsignIn("credentials", { email: ... })で渡ってきた場合
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) return null;

        // ユーザーをDB（Supabase）から検索
        // getUserはusernameを受け取る仕様だが、username=emailとして保存しているため検索可能
        const user = await getUser(email);

        if (user && user.password === password) {
          // パスワードを除外して返す
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password: _, ...userWithoutPassword } = user;
          return userWithoutPassword;
        }
        return null;
      },
    }),
  ],
});
