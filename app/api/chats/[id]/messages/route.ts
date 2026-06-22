import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Chat from '@/lib/models/Chat';
import { getAuthenticatedUser } from '@/lib/auth';

type Params = {
    id: string;
};

export async function POST(request: Request, { params }: { params: Promise<Params> }) {
    try {
        await connectDB();
        const user = await getAuthenticatedUser(request);
        if (!user) {
            return NextResponse.json({ message: 'Not authorized, token failed' }, { status: 401 });
        }

        const { id } = await params;
        const { message } = await request.json();
        const chat = await Chat.findById(id);

        if (chat) {
            if (chat.user.toString() !== user._id.toString() && !user.isAdmin) {
                return NextResponse.json({ message: 'Not authorized to send messages in this chat' }, { status: 403 });
            }

            const newMessage = {
                sender: user._id,
                senderModel: 'User',
                message,
                isRead: false,
                timestamp: new Date()
            };

            chat.messages.push(newMessage);
            chat.lastMessage = message;

            if (!user.isAdmin) {
                chat.unreadCount += 1;
            }

            await chat.save();

            const updatedChat = await Chat.findById(chat._id)
                .populate('user', 'name email avatar');

            return NextResponse.json(updatedChat);
        } else {
            return NextResponse.json({ message: 'Chat not found' }, { status: 404 });
        }
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
