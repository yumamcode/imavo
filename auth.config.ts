import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      // ログインページと登録ページ以外を保護対象とする
      const isOnLoginPage = nextUrl.pathname.startsWith('/login');
      const isOnRegisterPage = nextUrl.pathname.startsWith('/register');
      const isStaticAsset = nextUrl.pathname.startsWith('/_next') || nextUrl.pathname.includes('.');

      if (isStaticAsset) return true;

      if (isOnLoginPage || isOnRegisterPage) {
        if (isLoggedIn) {
          // ログイン済みならトップへ
          return Response.redirect(new URL('/', nextUrl));
        }
        return true;
      }

      // 未ログインならログインページへ（NextAuthが自動でリダイレクトするが、明示的にfalseを返すとsignInページへ飛ぶ）
      if (!isLoggedIn) {
        return false;
      }

      return true;
    },
  },
  providers: [], // auth.tsで設定するためここは空
} satisfies NextAuthConfig;

