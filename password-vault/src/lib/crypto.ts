import CryptoJS from 'crypto-js';

// For demo purposes, using a fixed key. In production, derive from user's password.
const SECRET_KEY = 'my-secret-key-for-demo';

export function encrypt(data: string): string {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
}

export function decrypt(encryptedData: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}