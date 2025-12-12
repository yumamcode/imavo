import { verifyToken, deleteToken } from "@/app/lib/tokens";
import { supabase } from "@/app/lib/supabase";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { token, email } = await searchParams;

  if (!token || !email || typeof token !== "string" || typeof email !== "string") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-4">
        <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8 text-center">
          <h1 className="text-xl font-bold text-red-500 mb-4">無効なリンクです</h1>
          <Link href="/login" className="text-zinc-900 dark:text-zinc-100 underline">
            ログインへ戻る
          </Link>
        </div>
      </div>
    );
  }

  const validToken = await verifyToken(email, token);

  if (!validToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-4">
        <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8 text-center">
          <h1 className="text-xl font-bold text-red-500 mb-4">リンクの有効期限が切れているか、無効です</h1>
          <Link href="/register" className="text-zinc-900 dark:text-zinc-100 underline">
            再度登録する
          </Link>
        </div>
      </div>
    );
  }

  // ユーザーのemailVerifiedを更新
  const { error } = await supabase
    .from("users")
    .update({ emailVerified: new Date() })
    .eq("email", email);

  if (error) {
    console.error("Error verifying email:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-4">
        <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8 text-center">
          <h1 className="text-xl font-bold text-red-500 mb-4">エラーが発生しました</h1>
          <p>管理者に問い合わせてください。</p>
        </div>
      </div>
    );
  }

  // トークンを削除
  await deleteToken(email, token);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8 text-center">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">本登録完了</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-6">
          メールアドレスの確認が完了しました。
        </p>
        <Link
          href="/login"
          className="inline-block py-3 px-6 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          ログインする
        </Link>
      </div>
    </div>
  );
}



