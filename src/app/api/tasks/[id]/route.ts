import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';
import Task from '@/models/Task';

// GET single task by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        const { id } = params;

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid Task ID' }, { status: 400 });
        }

        const task = await Task.findById(id);
        if (!task) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        return NextResponse.json(task);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 });
    }
}

// PATCH (update) a Task by ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        const { id } = params;
        const {
            title,
            description,
            status,
            priority,
            dueDate,
            tags,
            assignedTo,
        } = await req.json();

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid Task ID' }, { status: 400 });
        }

        const updatedTask = await Task.findByIdAndUpdate(id, {
            title,
            description,
            status,
            priority,
            dueDate,
            tags,
            assignedTo,
            }, { new: true });
        if (!updatedTask) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        return NextResponse.json(updatedTask);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to update task' }, { status: 400 });
    }
}

// DELETE a Task by ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        const { id } = params;

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid Task ID' }, { status: 400 });
        }

        const deletedTask = await Task.findByIdAndDelete(id);
        if (!deletedTask) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to delete Tas' }, { status: 500 });
    }
}
