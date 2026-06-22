import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Chat from '@/lib/models/Chat';
import { getAuthenticatedUser } from '@/lib/auth';

type Params = {
    id: string;
};

export async function GET(request: Request, { params }: { params: Promise<Params> }) {
    try {
        await connectDB();
        const user = await getAuthenticatedUser(request);
        if (!user) {
            return NextResponse.json({ message: 'Not authorized, token failed' }, { status: 401 });
        }

        const { id } = await params;
        const chat = await Chat.findById(id).populate('user', 'name email avatar');

        if (chat) {
            if (chat.user._id.toString() === user._id.toString() || user.isAdmin) {
                return NextResponse.json(chat);
            } else {
                return NextResponse.json({ message: 'Not authorized to access this chat' }, { status: 403 });
            }
        } else {
            return NextResponse.json({ message: 'Chat not found' }, { status: 404 });
        }
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
