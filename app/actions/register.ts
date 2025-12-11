"use server";

import { saveUser } from "@/app/lib/users";
import { generateVerificationToken } from "@/app/lib/tokens";
import { sendVerificationEmail } from "@/app/lib/mail";

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

    // トークン生成
    const token = await generateVerificationToken(email);

    // メール送信（現在はコンソール出力のみ）
    await sendVerificationEmail(email, token);

    return { success: true };

  } catch (err: any) {
    if (err.message === 'Username already exists') {
      return { error: "このメールアドレスは既に登録されています" };
    }
    console.error(err);
    return { error: "登録中にエラーが発生しました" };
  }
}


