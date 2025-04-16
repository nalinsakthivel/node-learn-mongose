import { Document, Schema, model } from "mongoose";
import { StatusType } from "../enum/StatusType";

export interface TaskModel extends Document {
  id?: number;
  title: string;
  image: string;
  userId?: string;
  status?: StatusType;
}

const taskSchema = new Schema<TaskModel>({
  id: { required: true, unique: true, type: Number },
  title: { required: true, type: String },
  image: { required: true, type: String },
  userId: { required: true, unique: true, type: String },
  status: { required: true, type: Number, enum: StatusType },
});

export const TaskModel = model<TaskModel>("tasks", taskSchema);
