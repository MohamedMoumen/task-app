import dbConnect from "@/lib/dbConnect";
import Task from "@/models/Task";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from 'next-auth/jwt';
import mongoose from "mongoose";
const secret = process.env.NEXTAUTH_SECRET;

// GET Tasks
export async function GET() {
    await dbConnect();
    console.log(mongoose.models);
    try {
        const tasks = await Task.find({})
        .populate({
            path: 'assignedTo',
            select: 'name email'
        }).populate({
            path: 'createdBy',
            select: 'name email'
        });
        return NextResponse.json(tasks);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
    }
}

// POST Task
export async function POST(req: NextRequest) {
    await dbConnect();
    console.log(req);
    try {
        const token = await getToken({ req, secret });
        console.log(token);
        const {
            title,
            description,
            status,
            priority,
            dueDate,
            tags,
            assignedTo,
        } = await req.json();
        const newTask = await Task.create({
            title,
            description,
            status,
            priority,
            dueDate,
            tags,
            assignedTo,
            createdBy: token.id,
        });
        return NextResponse.json(newTask, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
    }
}