import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  apiKey: string;
}

const userSchema: Schema<IUser> = new Schema({
  email: { type: String, required: [true, "Please add an email"], unique: true, validate: { validator: (v: string) => /\S+@\S+\.\S+/.test(v), message: "Please add a valid email" }, index: true },
  password: { type: String, required: [true, "Please add a password"], validate: { validator: (v: string) => v.length >= 6, message: "Password must be at least 6 characters long" }, index: true },
  apiKey: { type: String, required: [true, "Please add a user API key"], unique: true },
});

export default mongoose.model<IUser>("User", userSchema);