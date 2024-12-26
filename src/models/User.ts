import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  email: string;
  password: string;
  apiKey: string;
}

const UserSchema: Schema<IUser> = new Schema({
  email: { type: String, required: [true, "Please add an email"], unique: true, validate: { validator: (v: string) => /\S+@\S+\.\S+/.test(v), message: "Please add a valid email" }, index: true },
  password: { type: String, required: [true, "Please add a password"], validate: { validator: (v: string) => v.length >= 6, message: "Password must be at least 6 characters long" }, index: true },
  apiKey: { type: String, required: [true, "Please add a user API key"], unique: true },
});

// Hash the password before saving the user model
UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  const user = this as IUser;
  if (!user.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default mongoose.model<IUser>("User", UserSchema);