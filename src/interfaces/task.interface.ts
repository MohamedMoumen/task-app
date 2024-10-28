import { Timestamps } from "./common.interface";
import { IUser } from "./user.interface";
import { Document } from 'mongoose';

export interface ITask extends Timestamps, Document {
    _id: string;
    title: string;
    description?: string;
    status: Status;
    priority: Priority;
    dueDate: Date;
    tags: [string];
    assignedTo: IUser;
    createdBy: IUser;
    createdAt: any;
}

export enum Status {
    pending = 'pending',
    in_progress = 'in-progress',
    completed = 'completed',
    archived = 'archived',
}

export enum Priority {
    low = 'low',
    medium = 'medium',
    high = 'high',
    urgent = 'urgent',
}