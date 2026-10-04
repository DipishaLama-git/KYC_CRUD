import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);
const KEY_LENGTH = 64;

export async function hashPassword(plainPassword: string): Promise<{ hash: string; salt: string }> {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = (await scryptAsync(plainPassword, salt, KEY_LENGTH)) as Buffer;
  return { hash: derivedKey.toString('hex'), salt };
}

export async function verifyPassword(plainPassword: string, salt: string, expectedHash: string): Promise<boolean> {
  const derivedKey = (await scryptAsync(plainPassword, salt, KEY_LENGTH)) as Buffer;
  const expectedBuffer = Buffer.from(expectedHash, 'hex');
  if (derivedKey.length !== expectedBuffer.length) {
    return false;
  }
  return timingSafeEqual(derivedKey, expectedBuffer);
}
