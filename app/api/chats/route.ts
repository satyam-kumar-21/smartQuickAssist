import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Chat from '@/lib/models/Chat';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        await connectDB();
        const adminUser = await getAuthenticatedUser(request);
        if (!adminUser || !adminUser.isAdmin) {
            return NextResponse.json({ message: 'Not authorized as an admin' }, { status: 401 });
        }

        const chats = await Chat.find()
            .populate('user', 'name email avatar')
            .sort({ updatedAt: -1 });

        return NextResponse.json(chats);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
