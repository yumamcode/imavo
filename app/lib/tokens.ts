import { supabase } from "./supabase";
import { v4 as uuidv4 } from "uuid";

export async function generateVerificationToken(email: string) {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour

  // 既存のトークンがあれば削除
  await supabase
    .from("verification_tokens")
    .delete()
    .eq("identifier", email);

  // 新しいトークンを保存
  const { error } = await supabase
    .from("verification_tokens")
    .insert({
      identifier: email,
      token,
      expires,
    });

  if (error) {
    console.error("Error creating verification token:", error);
    throw new Error("Failed to create verification token");
  }

  return token;
}

export async function verifyToken(identifier: string, token: string) {
  const { data, error } = await supabase
    .from("verification_tokens")
    .select("*")
    .eq("identifier", identifier)
    .eq("token", token)
    .single();

  if (error || !data) {
    return null;
  }

  const expires = new Date(data.expires);
  if (expires < new Date()) {
    return null; // Expired
  }

  return data;
}

export async function deleteToken(identifier: string, token: string) {
  await supabase
    .from("verification_tokens")
    .delete()
    .eq("identifier", identifier)
    .eq("token", token);
}

