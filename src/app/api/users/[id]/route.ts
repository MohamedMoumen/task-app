import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { ObjectId } from 'mongodb';

// GET single user by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        const { id } = params;

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid User ID' }, { status: 400 });
        }

        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user); // Respond with the user data
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
    }
}

// PATCH (update) a user by ID
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        const { id } = params;
        const { name, email, password } = await req.json(); // Parse request body

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid User ID' }, { status: 400 });
        }

        const updatedUser = await User.findByIdAndUpdate(id, { name, email, password }, { new: true });
        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(updatedUser); // Respond with updated user data
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 400 });
    }
}

// DELETE a user by ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        const { id } = params;

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid User ID' }, { status: 400 });
        }

        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'User deleted successfully' }); // Respond with success message
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}
