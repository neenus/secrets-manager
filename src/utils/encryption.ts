import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY as string;
const IV_LENGTH = 16;

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 64) {
  throw new Error('Invalid ENCRYPTION_KEY. It must be a 64-character hex string.');
}

export const encrypt = (text: string | object): string => {
  const textToEncrypt = typeof text === 'string' ? text : JSON.stringify(text);
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  const encryptedText = Buffer.concat([cipher.update(textToEncrypt, 'utf8'), cipher.final()]);
  return `${iv.toString('hex')}:${encryptedText.toString('hex')}`;
}

export const decrypt = (encryptedText: string): string => {
  const [iv, encrypted] = encryptedText.split(':');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), Buffer.from(iv, 'hex'));
  const decryptedText = Buffer.concat([decipher.update(Buffer.from(encrypted, 'hex')), decipher.final()]);
  return decryptedText.toString();
}