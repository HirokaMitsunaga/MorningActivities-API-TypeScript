import { hash, compare } from "bcrypt";

//パスワードをハッシュ化する関数
export const hashPassword = async (password: string): Promise<string> => {
  return await hash(password, 10);
};

//パスワードのハッシュが正しいかを確認する関数
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await compare(password, hashedPassword);
};
