import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';
import User from '@/lib/models/User';
import Product from '@/lib/models/Product';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        await connectDB();
        const adminUser = await getAuthenticatedUser(request);
        if (!adminUser || !adminUser.isAdmin) {
            return NextResponse.json({ message: 'Not authorized as an admin' }, { status: 401 });
        }

        const totalOrders = await Order.countDocuments();
        const totalRevenueResult = await Order.aggregate([
            { $match: { isPaid: true } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);
        const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;
        const totalCustomers = await User.countDocuments({ isAdmin: false });
        const totalProducts = await Product.countDocuments();

        return NextResponse.json({
            totalOrders,
            totalRevenue,
            totalCustomers,
            totalProducts
        });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
