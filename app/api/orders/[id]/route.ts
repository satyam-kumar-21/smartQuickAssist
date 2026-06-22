import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';
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
        const order = await Order.findById(id).populate('user', 'name email');

        if (order) {
            // Secure order details access (must be the owner or an admin)
            if (order.user._id.toString() !== user._id.toString() && !user.isAdmin) {
                return NextResponse.json({ message: 'Not authorized to view this order' }, { status: 401 });
            }
            return NextResponse.json(order);
        } else {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
