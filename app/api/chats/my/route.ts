import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Chat from '@/lib/models/Chat';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        await connectDB();
        const user = await getAuthenticatedUser(request);
        if (!user) {
            return NextResponse.json({ message: 'Not authorized, token failed' }, { status: 401 });
        }

        let chat = await Chat.findOne({ user: user._id })
            .populate('user', 'name email avatar');

        if (!chat) {
            chat = await Chat.create({
                user: user._id,
                messages: [],
                status: 'active'
            });
            chat = await Chat.findById(chat._id).populate('user', 'name email avatar');
        }

        return NextResponse.json(chat);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
