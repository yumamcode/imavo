"use server";

import { saveUser } from "@/app/lib/users";
import { signIn } from "@/auth";

export async function registerUser(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string || username;

  if (!username || !password) {
    return { error: "ユーザー名とパスワードは必須です" };
  }

  try {
    // ユーザー保存
    await saveUser({
      username,
      password,
      name,
      email: `${username}@example.com`, // ダミーメールアドレス
    });

    // 登録成功後、自動的にログイン（signInは内部でredirectするためtry-catchの外で行うか、redirect: falseを使う）
    // Server Action内でのsignInはリダイレクトを伴うため、ここで終了
  } catch (err: any) {
    if (err.message === 'Username already exists') {
      return { error: "このユーザー名は既に使用されています" };
    }
    console.error(err);
    return { error: "登録中にエラーが発生しました" };
  }
  
  // 登録成功したらログイン処理へ
  await signIn("credentials", {
    username,
    password,
    redirectTo: "/",
  });
}


