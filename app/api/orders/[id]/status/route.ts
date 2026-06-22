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
        const adminUser = await getAuthenticatedUser(request);
        if (!adminUser || !adminUser.isAdmin) {
            return NextResponse.json({ message: 'Not authorized as an admin' }, { status: 401 });
        }

        const { id } = await params;
        const order = await Order.findById(id);

        if (order) {
            const body = await request.json();
            order.status = body.status || order.status;
            order.tracking = {
                currentLocation: body.currentLocation || order.tracking.currentLocation,
                estTime: body.estTime || order.tracking.estTime,
            };

            if (order.status === 'Delivered') {
                order.isDelivered = true;
                order.deliveredAt = Date.now();
            }

            const updatedOrder = await order.save();
            return NextResponse.json(updatedOrder);
        } else {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
