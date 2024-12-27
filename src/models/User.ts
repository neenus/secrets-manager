import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import ErrorResponse from "@utils/errorResponse";

export interface IUser extends Document {
  email: string;
  password: string;
  apiKey: string;
  compareHash(hashValue: string, hashType: "password" | "apiKey"): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema({
  email: { type: String, required: [true, "Please add an email"], unique: true, validate: { validator: (v: string) => /\S+@\S+\.\S+/.test(v), message: "Please add a valid email" }, index: true },
  password: { type: String, required: [true, "Please add a password"], validate: { validator: (v: string) => v.length >= 6, message: "Password must be at least 6 characters long" }, index: true },
  apiKey: { type: String, required: [true, "Please add a user API key"], unique: true },
});

// Hash the password and API key before saving the user model
UserSchema.pre("save", async function (next) {
  const user = this as IUser;
  if (user.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
  if (user.isModified("apiKey")) {
    const salt = await bcrypt.genSalt(10);
    user.apiKey = await bcrypt.hash(user.apiKey, salt);
  }
  next();
});

// Validate user password and API key and compare it to the hashed value in the database
UserSchema.methods.compareHash = async function (hashValue: string, hashType: "password" | "apiKey"): Promise<boolean> {
  if (hashType && !this[hashType]) throw new ErrorResponse(`${hashType} is not set`, 400);
  return await bcrypt.compare(hashValue, this[hashType]);
}

export default mongoose.model<IUser>("User", UserSchema);