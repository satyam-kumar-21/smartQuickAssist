import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        await connectDB();
        const adminUser = await getAuthenticatedUser(request);
        if (!adminUser || !adminUser.isAdmin) {
            return NextResponse.json({ message: 'Not authorized as an admin' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const pageSize = Number(searchParams.get('limit')) || 20;
        const page = Number(searchParams.get('page')) || 1;
        const search = searchParams.get('search') || '';

        let query: any = {};

        if (search) {
             query = {
                 $or: [
                    ...(mongoose.Types.ObjectId.isValid(search) ? [{ _id: search }] : []),
                    { 'shippingAddress.address': { $regex: search, $options: 'i' } },
                    { 'shippingAddress.city': { $regex: search, $options: 'i' } },
                    { 'shippingAddress.postalCode': { $regex: search, $options: 'i' } },
                    { 'shippingAddress.country': { $regex: search, $options: 'i' } },
                    { status: { $regex: search, $options: 'i' } }
                ]
             };
        }

        const count = await Order.countDocuments(query);
        const orders = await Order.find(query)
            .populate('user', '_id name email')
            .sort({ createdAt: -1 })
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        return NextResponse.json({ orders, page, pages: Math.ceil(count / pageSize), total: count });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const user = await getAuthenticatedUser(request);
        if (!user) {
            return NextResponse.json({ message: 'Not authorized, token failed' }, { status: 401 });
        }

        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        } = await request.json();

        if (orderItems && orderItems.length === 0) {
            return NextResponse.json({ message: 'No order items' }, { status: 400 });
        }

        const order = new Order({
            orderItems: orderItems.map((x: any) => ({
                name: x.title,
                qty: x.qty,
                image: x.image,
                price: x.price,
                product: x.product,
            })),
            user: user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();
        return NextResponse.json(createdOrder, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
