import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { getUser } from './app/lib/users';

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        
        // ユーザーをDB（JSON）から検索
        const user = await getUser(credentials.username as string);
        
        if (user && user.password === credentials.password) {
          // パスワードを除外して返すのが理想だが、型定義上ここではそのまま返す（実際のアプリではハッシュ化必須）
          const { password, ...userWithoutPassword } = user;
          return userWithoutPassword;
        }
        return null;
      },
    }),
  ],
});
