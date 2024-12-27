import { Request, Response, NextFunction } from "express";
import User from "@models/User";
import ErrorResponse from "@utils/errorResponse";
import crypto from "crypto";

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;
  const apiKey = crypto.randomBytes(24).toString("hex");
  const apiKeyIdentifier = crypto.createHash("sha256").update(apiKey).digest("hex").substring(0, 16);

  // check if password is at least 6 characters long
  if (password.length < 6) return next(new ErrorResponse("Password must be at least 6 characters long", 400));

  try {
    const user = await User.findOne({ email });
    if (user) return next(new ErrorResponse("User already exists", 400));

    const newUser = new User({ email, password, apiKey, apiKeyIdentifier });
    await newUser.save();
    res.status(201).json({ success: true, data: newUser });
  } catch (err: any) {
    return next(new ErrorResponse("Internal server error", err.statusCode || 500));
  }
};
