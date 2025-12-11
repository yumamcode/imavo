import { supabase } from "./supabase";
import testUsers from "../data/users.json";

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  password?: string;
  image?: string;
  emailVerified?: Date | null;
}

// ユーザーデータを読み込む（全件取得は推奨されないため、必要最低限の実装あるいは空配列を返す）
export async function getUsers(): Promise<User[]> {
  const { data, error } = await supabase.from("users").select("*");
  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }
  return data as User[];
}

// ユーザーデータを保存する
export async function saveUser(user: Omit<User, "id">): Promise<User> {
  // 重複チェック
  const existingUser = await getUser(user.username);
  if (existingUser) {
    throw new Error("Username already exists");
  }

  // Supabaseにインサート
  // idはSupabase側で生成（uuid）させるか、ここで生成するか。
  // NextAuthのUserモデルに合わせるならuuidが望ましい。
  // ここではSupabaseに任せるため、insert後に返ってきたデータを使う。

  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        ...user,
        emailVerified: null, // NextAuth用のフィールド初期化
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Error saving user: ${error.message}`);
  }

  return data as User;
}

// ユーザーを検索する
export async function getUser(username: string): Promise<User | undefined> {
  // テストユーザー（JSON）から検索
  const testUser = testUsers.find((user) => user.username === username);
  if (testUser) {
    return testUser as User;
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single();

    if (error) {
      // 見つからない場合もエラーになることがあるので、データがない場合はundefinedを返す
      return undefined;
    }
    return data as User;
  } catch (error) {
    console.error("Unexpected error fetching user:", error);
    return undefined;
  }
}
