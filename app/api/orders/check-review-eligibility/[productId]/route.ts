import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';
import { getAuthenticatedUser } from '@/lib/auth';

type Params = {
    productId: string;
};

export async function GET(request: Request, { params }: { params: Promise<Params> }) {
    try {
        await connectDB();
        const user = await getAuthenticatedUser(request);
        if (!user) {
            return NextResponse.json({ message: 'Not authorized, token failed' }, { status: 401 });
        }

        const { productId } = await params;

        // Admins can always review
        if (user.isAdmin) {
            return NextResponse.json({ canReview: true });
        }

        const order = await Order.findOne({
            user: user._id,
            'orderItems.product': productId,
            isDelivered: true
        });

        if (order) {
            return NextResponse.json({ canReview: true });
        } else {
            return NextResponse.json({ canReview: false });
        }
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
