import { Document } from 'mongoose';

export interface IUser extends Document {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: string;
}

export enum Role {
    admin = 'admin',
    user = 'user',
}