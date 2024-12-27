import crypto from 'crypto';

export const createApiKeyIdentifier = (apiKey: string): string => crypto.createHash('sha256').update(apiKey).digest('hex').substring(0, 16);