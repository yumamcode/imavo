"use client";

import { useState } from "react";
import { registerUser } from "../actions/register";
import Link from "next/link";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setError("");
    const result = await registerUser(formData);
    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-4">
        <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8 space-y-6 text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">仮登録完了</h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            登録されたメールアドレスに確認メールを送信しました。メール内のリンクをクリックして本登録を完了してください。
          </p>
          <div className="text-sm text-zinc-400">
            ※現在はテストモードのため、ターミナル（コンソール）にリンクが表示されています。
          </div>
          <Link href="/login" className="inline-block mt-4 text-zinc-900 dark:text-zinc-100 underline underline-offset-4 font-medium hover:text-zinc-600 dark:hover:text-zinc-300">
            ログインページへ戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Imavo 新規登録</h1>
          <p className="text-zinc-500 dark:text-zinc-400">アカウントを作成して学習を始めましょう</p>
        </div>

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              メールアドレス <span className="text-red-500">*</span>
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-zinc-500 outline-none"
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              パスワード <span className="text-red-500">*</span>
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-zinc-500 outline-none"
              placeholder="password"
            />
          </div>

          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            アカウント作成
          </button>
        </form>

        <div className="text-center text-sm text-zinc-500">
          すでにアカウントをお持ちの方は{" "}
          <Link href="/login" className="text-zinc-900 dark:text-zinc-100 underline underline-offset-4 font-medium hover:text-zinc-600 dark:hover:text-zinc-300">
            ログイン
          </Link>
        </div>
      </div>
    </div>
  );
}


