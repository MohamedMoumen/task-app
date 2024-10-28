import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { IUser } from '@/interfaces/user.interface';
import { hash } from 'bcrypt';
import mongoose from 'mongoose';

// GET Users
export async function GET() {
    await dbConnect();
    console.log(mongoose.models);
    try {
        const users = await User.find({});
        return NextResponse.json(users);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

// POST User
export async function POST(req: Request) {
    await dbConnect();
    try {
        const { name, email, password } = await req.json();
        const findUser: IUser | null = await User.findOne({ email });
        if(findUser) return NextResponse.json({ error: 'User Already Exists' }, { status: 409 });
        const hashedPassword = await hash(password, 10);
        const newUser = await User.create({ name: name, email: email, password: hashedPassword });
        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 400 });
    }
}
