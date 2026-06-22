import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';
import { getAuthenticatedUser } from '@/lib/auth';

type Params = {
    id: string;
};

export async function PUT(request: Request, { params }: { params: Promise<Params> }) {
    try {
        await connectDB();
        const user = await getAuthenticatedUser(request);
        if (!user) {
            return NextResponse.json({ message: 'Not authorized, token failed' }, { status: 401 });
        }

        const { id } = await params;
        const order = await Order.findById(id);

        if (order) {
            const body = await request.json();
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: body.id,
                status: body.status,
                update_time: body.update_time,
                email_address: body.payer?.email_address || body.email_address || '',
            };

            const updatedOrder = await order.save();
            return NextResponse.json(updatedOrder);
        } else {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
