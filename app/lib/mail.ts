export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/verify-email?token=${token}&email=${email}`;
  
  console.log("----------------------------------------------------");
  console.log(`Sending verification email to ${email}`);
  console.log(`Link: ${confirmLink}`);
  console.log("----------------------------------------------------");

  // ここでResendやNodemailerなどを使って実際にメールを送信する実装を行う
}
