import { Request, Response, NextFunction } from "express";
import ErrorResponse from "@utils/errorResponse";
import User from "@models/User";

const authenticateApiKey = async (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.header("x-api-key");
  const email = req.body.email;

  // check if API key is provided
  if (!apiKey) return next(new ErrorResponse("API Key is invalid", 401));

  // find the user with the provided email
  const user = await User.findOne({ email });
  if (!user) return next(new ErrorResponse("User not found", 404));

  // validate the API key using the schema method matchApiKey
  const isMatch = await user.compareHash(apiKey, "apiKey");
  if (!isMatch) return next(new ErrorResponse("Invalid API Key", 401));

  // if the API key is valid, proceed to the next middleware
  next();
}

export default authenticateApiKey;