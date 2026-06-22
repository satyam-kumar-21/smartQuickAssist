import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Chat from '@/lib/models/Chat';
import { getAuthenticatedUser } from '@/lib/auth';

type Params = {
    id: string;
};

export async function PUT(request: Request, { params }: { params: Promise<Params> }) {
    try {
        await connectDB();
        const adminUser = await getAuthenticatedUser(request);
        if (!adminUser || !adminUser.isAdmin) {
            return NextResponse.json({ message: 'Not authorized as an admin' }, { status: 401 });
        }

        const { id } = await params;
        const chat = await Chat.findById(id);

        if (chat) {
            chat.status = 'closed';
            await chat.save();
            return NextResponse.json({ message: 'Chat closed' });
        } else {
            return NextResponse.json({ message: 'Chat not found' }, { status: 404 });
        }
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
