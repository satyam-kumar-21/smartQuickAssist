import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Cart from '@/lib/models/Cart';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        await connectDB();
        const user = await getAuthenticatedUser(request);
        if (!user) {
            return NextResponse.json({ message: 'Not authorized, token failed' }, { status: 401 });
        }

        const cart = await Cart.findOne({ user: user._id });
        return NextResponse.json(cart ? cart.items : []);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        await connectDB();
        const user = await getAuthenticatedUser(request);
        if (!user) {
            return NextResponse.json({ message: 'Not authorized, token failed' }, { status: 401 });
        }

        const { items } = await request.json();

        let cart = await Cart.findOne({ user: user._id });
        if (cart) {
            cart.items = items;
            await cart.save();
        } else {
            cart = await Cart.create({ user: user._id, items });
        }
        return NextResponse.json(cart.items);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        await connectDB();
        const user = await getAuthenticatedUser(request);
        if (!user) {
            return NextResponse.json({ message: 'Not authorized, token failed' }, { status: 401 });
        }

        await Cart.findOneAndDelete({ user: user._id });
        return NextResponse.json({ message: 'Cart cleared' });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
