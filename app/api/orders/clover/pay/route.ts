import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';
import { getAuthenticatedUser } from '@/lib/auth';
import axios from 'axios';

export async function POST(request: Request) {
    try {
        await connectDB();
        const user = await getAuthenticatedUser(request);
        if (!user) {
            return NextResponse.json({ message: 'Not authorized, token failed' }, { status: 401 });
        }

        const { amount, orderId, source } = await request.json();

        if (!amount || !orderId || !source) {
            return NextResponse.json({ message: 'Missing payment data' }, { status: 400 });
        }

        const cloverUrl = 'https://api.clover.com/v1/charges';

        try {
            const response = await axios.post(
                cloverUrl,
                {
                    amount: Math.round(amount * 100), // cents
                    currency: 'USD',
                    source, // token from frontend
                    metadata: { orderId },
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.CLOVER_PRIVATE_KEY}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.data || !response.data.id) {
                return NextResponse.json({ message: 'Clover payment failed' }, { status: 400 });
            }

            const order = await Order.findById(orderId);
            if (!order) {
                return NextResponse.json({ message: 'Order not found' }, { status: 404 });
            }

            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: response.data.id,
                status: response.data.status,
            };

            await order.save();

            return NextResponse.json({
                success: true,
                message: 'Payment successful',
                payment: response.data
            });
        } catch (paymentErr: any) {
            console.error(paymentErr.response?.data || paymentErr.message);
            return NextResponse.json({ message: paymentErr.response?.data?.message || 'Payment failed' }, { status: 400 });
        }
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
