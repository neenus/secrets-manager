import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from "@models/User";

export interface ISecret extends Document {
  user: IUser['_id'];
  apiKeyIdentifier: string;
  projectName: string;
  secrets: Map<string, string>;
}

const SecretSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'Please add a user'] },
  apiKeyIdentifier: { type: String, required: [true, 'Please add an API key identifier'] },
  projectName: { type: String, required: [true, 'Please add a project name'], unique: true },
  secrets: { type: Map, of: String, required: [true, 'Please add secrets'] },
},
  {
    timestamps: true
  }
);

export default mongoose.model<ISecret>("Secret", SecretSchema);