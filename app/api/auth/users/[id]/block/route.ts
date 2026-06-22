import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
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
        const user = await User.findById(id);

        if (user) {
            if (user.isAdmin) {
                return NextResponse.json({ message: 'Cannot block admin user' }, { status: 400 });
            }
            user.isBlocked = true;
            await user.save();
            return NextResponse.json({ message: 'User blocked successfully' });
        } else {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
