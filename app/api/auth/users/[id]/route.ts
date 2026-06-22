import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { getAuthenticatedUser } from '@/lib/auth';

type Params = {
    id: string;
};

export async function DELETE(request: Request, { params }: { params: Promise<Params> }) {
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
                return NextResponse.json({ message: 'Cannot delete admin user' }, { status: 400 });
            }
            await user.deleteOne();
            return NextResponse.json({ message: 'User removed' });
        } else {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
