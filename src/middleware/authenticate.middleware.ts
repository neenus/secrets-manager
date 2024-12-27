import { Request, Response, NextFunction } from "express";
import ErrorResponse from "@utils/errorResponse";
import User from "@models/User";
import crypto from "crypto";

const authenticateApiKey = async (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.header("x-api-key");

  // check if API key is provided
  if (!apiKey) return next(new ErrorResponse("API Key is invalid", 401));

  // Derive identifier from the API key
  const apiKeyIdentifier = crypto.createHash("sha256").update(apiKey).digest("hex").substring(0, 16);

  try {
    // find the user with the apiKeyIdentifier
    const user = await User.findOne({ apiKeyIdentifier });
    if (!user) return next(new ErrorResponse("Invalid API Key", 404));

    // validate the API key using the schema method matchApiKey
    const isMatch = await user.compareHash(apiKey, "apiKey");
    if (!isMatch) return next(new ErrorResponse("Invalid API Key", 401));

    next();
  } catch (error: any) {
    return next(new ErrorResponse(error.message || "Internal server error", 500));
  }
}

export default authenticateApiKey;