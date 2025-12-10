import fs from 'fs/promises';
import path from 'path';

const dbPath = path.join(process.cwd(), 'app/data/users.json');

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  password?: string;
}

// ユーザーデータを読み込む
export async function getUsers(): Promise<User[]> {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// ユーザーデータを保存する
export async function saveUser(user: Omit<User, 'id'>): Promise<User> {
  const users = await getUsers();
  
  // 重複チェック
  if (users.some(u => u.username === user.username)) {
    throw new Error('Username already exists');
  }

  const newUser = {
    ...user,
    id: Date.now().toString(),
  };

  users.push(newUser);
  await fs.writeFile(dbPath, JSON.stringify(users, null, 2));
  return newUser;
}

// ユーザーを検索する
export async function getUser(username: string): Promise<User | undefined> {
  const users = await getUsers();
  return users.find(user => user.username === username);
}


