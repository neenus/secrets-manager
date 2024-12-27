import { Request, Response, NextFunction } from 'express';
import Secret from '@models/Secret';
import User from "@models/User";
import { encrypt, decrypt } from '@utils/encryption';
import ErrorResponse from "@utils/errorResponse";
import { createApiKeyIdentifier } from "@utils/createApiKeyIdentifier";

export const getSecretsByProjectName = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const apiKey = req.headers['x-api-key'] as string;
    const { projectName } = req.query;
    const apiKeyIdentifier = createApiKeyIdentifier(apiKey);

    if (!apiKey) return next(new ErrorResponse('API key is required', 400));
    if (!projectName) return next(new ErrorResponse('Project name is required', 400));

    const secretDoc = await Secret.findOne({ apiKeyIdentifier, projectName }).populate('user');
    if (!secretDoc) return next(new ErrorResponse('Secrets not found', 404));

    const decryptedSecrets: { [key: string]: string } = {};
    secretDoc.secrets.forEach((value, key) => {
      decryptedSecrets[key] = decrypt(value);
    });

    // parse the decrypted secrets to JSON
    for (const key in decryptedSecrets) {
      try {
        decryptedSecrets[key] = JSON.parse(decryptedSecrets[key]);
      } catch (err) {
        // do nothing
      }
    }

    res.status(200).json({ projectName, decryptedSecrets });
  } catch (err: any) {
    return next(new ErrorResponse('Internal server error', err.statusCode || 500));
  }
};

export const saveSecrets = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { projectName } = req.query;
    const secrets = req.body;

    if (!projectName || !secrets) {
      return next(new ErrorResponse('Project name and secrets are required', 400));
    }

    const apiKey = req.headers['x-api-key'] as string;
    if (!apiKey) return next(new ErrorResponse('API key is required', 400));

    const apiKeyIdentifier = createApiKeyIdentifier(apiKey);
    const user = await User.findOne({ apiKeyIdentifier });
    if (!user) return next(new ErrorResponse('Invalid API Key', 401));

    const encryptedSecrets: { [key: string]: string } = {};
    Object.keys(secrets).forEach((key) => {
      encryptedSecrets[key] = encrypt(secrets[key]);
    });

    const secretDoc = await Secret.findOneAndUpdate(
      { user: user._id, projectName },
      { secrets: encryptedSecrets, apiKeyIdentifier },
      { upsert: true, new: true }
    );

    res.status(201).json(secretDoc);
  } catch (err: any) {
    return next(new ErrorResponse('Internal server error', err.statusCode || 500));
  }
}