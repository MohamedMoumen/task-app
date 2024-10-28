import { ITask, Priority, Status } from "@/interfaces/task.interface";
import mongoose, { Schema, model, Model } from "mongoose";

const TaskSchema = new Schema<ITask> ({
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.keys(Status),
      default: Status.pending,
    },
    priority: {
      type: String,
      enum: Object.keys(Priority),
      default: Priority.medium,
    },
    dueDate: {
      type: Date,
    },
    tags: {
      type: [String],
      default: [],
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
}, { timestamps: true });

const Task: Model<ITask> = mongoose.models.Task || model<ITask>('Task', TaskSchema);
export default Task;