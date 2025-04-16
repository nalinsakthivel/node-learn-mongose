import mongoose, { Document, Schema, model } from "mongoose";
import { StatusType } from "../enum/StatusType";

export interface UserModel extends Document {
  userid?: string;
  username: string;
  password: string;
  date?: Date;
  status?: StatusType;
}

const UserSchema = new Schema<UserModel>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userid: { type: String, required: true, unique: true },
  date: { type: Date, required: true },
  status: { type: Number, required: true, enum: StatusType },
});

export const UserModel = model<UserModel>("users", UserSchema);
