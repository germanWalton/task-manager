import mongoose, { Schema, Document } from "mongoose";
import { ITask } from "../interfaces/task.interface";

const TaskSchema: Schema = new Schema(
  {
    title: { type: String, required: true, unique: true, index: true },
    description: { type: String },
    completed: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export default mongoose.model<ITask & Document>("Task", TaskSchema);
