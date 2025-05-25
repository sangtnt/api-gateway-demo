import * as bcrypt from 'bcrypt';

export const hashString = (plainText: string, salt = 10): Promise<string> => {
  return bcrypt.hash(plainText, salt);
};
export const compareHashedString = (plainText: string, hashedStr: string): Promise<boolean> => {
  return bcrypt.compare(plainText, hashedStr);
};
