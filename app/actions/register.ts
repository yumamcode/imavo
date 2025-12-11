"use server";

import { saveUser } from "@/app/lib/users";
import { signIn } from "@/auth";

export async function registerUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  // usernameとnameにもemailを使用する
  const username = email;
  const name = email.split('@')[0]; // @の前を名前のデフォルトにする

  if (!email || !password) {
    return { error: "メールアドレスとパスワードは必須です" };
  }

  try {
    // ユーザー保存
    await saveUser({
      username,
      password,
      name,
      email,
    });

    // 登録成功後、自動的にログイン（signInは内部でredirectするためtry-catchの外で行うか、redirect: falseを使う）
    // Server Action内でのsignInはリダイレクトを伴うため、ここで終了
  } catch (err: any) {
    if (err.message === 'Username already exists') {
      return { error: "このメールアドレスは既に登録されています" };
    }
    console.error(err);
    return { error: "登録中にエラーが発生しました" };
  }
  
  // 登録成功したらログイン処理へ
  await signIn("credentials", {
    email,
    password,
    redirectTo: "/",
  });
}


