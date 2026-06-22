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

        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

        // Total Revenue (all paid orders, excluding cancelled)
        const revenueResult = await Order.aggregate([
            { $match: { isPaid: true, status: { $ne: 'Cancelled' } } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        // Current Month Revenue
        const currentMonthRevenue = await Order.aggregate([
            { $match: { isPaid: true, status: { $ne: 'Cancelled' }, createdAt: { $gte: currentMonthStart } } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);
        const currentRevenue = currentMonthRevenue.length > 0 ? currentMonthRevenue[0].total : 0;

        // Last Month Revenue
        const lastMonthRevenue = await Order.aggregate([
            { $match: { isPaid: true, status: { $ne: 'Cancelled' }, createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);
        const lastRevenue = lastMonthRevenue.length > 0 ? lastMonthRevenue[0].total : 0;

        // Revenue Growth Percentage
        const revenueGrowth = lastRevenue > 0
            ? (((currentRevenue - lastRevenue) / lastRevenue) * 100).toFixed(1)
            : currentRevenue > 0 ? '100' : '0';

        // Total Orders
        const totalOrders = await Order.countDocuments();
        const currentMonthOrders = await Order.countDocuments({ createdAt: { $gte: currentMonthStart } });
        const lastMonthOrders = await Order.countDocuments({
            createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd }
        });

        // Orders Growth Percentage
        const ordersGrowth = lastMonthOrders > 0
            ? (((currentMonthOrders - lastMonthOrders) / lastMonthOrders) * 100).toFixed(1)
            : currentMonthOrders > 0 ? '100' : '0';

        // Total Customers (non-admin users)
        const totalCustomers = await User.countDocuments({ isAdmin: false });
        const currentMonthCustomers = await User.countDocuments({
            isAdmin: false,
            createdAt: { $gte: currentMonthStart }
        });
        const lastMonthCustomers = await User.countDocuments({
            isAdmin: false,
            createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd }
        });

        // Customers Growth Percentage
        const customersGrowth = lastMonthCustomers > 0
            ? (((currentMonthCustomers - lastMonthCustomers) / lastMonthCustomers) * 100).toFixed(1)
            : currentMonthCustomers > 0 ? '100' : '0';

        // Recent Orders (last 10)
        const recentOrders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(10)
            .select('_id user totalPrice status isPaid createdAt');

        // Orders by Status
        const ordersByStatus = await Order.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // Active Stock
        const activeStock = await Product.countDocuments({ countInStock: { $gt: 0 } });

        // Revenue by Month (last 6 months)
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        const revenueByMonth = await Order.aggregate([
            { $match: { isPaid: true, status: { $ne: 'Cancelled' }, createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    revenue: { $sum: '$totalPrice' },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        return NextResponse.json({
            revenue: {
                total: totalRevenue,
                currentMonth: currentRevenue,
                lastMonth: lastRevenue,
                growth: parseFloat(revenueGrowth)
            },
            orders: {
                total: totalOrders,
                currentMonth: currentMonthOrders,
                lastMonth: lastMonthOrders,
                growth: parseFloat(ordersGrowth)
            },
            customers: {
                total: totalCustomers,
                currentMonth: currentMonthCustomers,
                lastMonth: lastMonthCustomers,
                growth: parseFloat(customersGrowth)
            },
            activeStock,
            recentOrders,
            ordersByStatus,
            revenueByMonth
        });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
