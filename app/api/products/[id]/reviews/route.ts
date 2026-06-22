import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/lib/models/Product';
import Order from '@/lib/models/Order';
import { getAuthenticatedUser } from '@/lib/auth';

type Params = {
    id: string;
};

export async function POST(request: Request, { params }: { params: Promise<Params> }) {
    try {
        await connectDB();
        const user = await getAuthenticatedUser(request);
        if (!user) {
            return NextResponse.json({ message: 'Not authorized, token failed' }, { status: 401 });
        }

        const { rating, comment } = await request.json();
        const { id } = await params;
        const product = await Product.findById(id);

        if (!product) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        // Check if user has purchased the product and it is delivered
        // Admins can always review
        if (!user.isAdmin) {
             const order = await Order.findOne({
                user: user._id,
                'orderItems.product': id,
                isDelivered: true
            });

            if (!order) {
                return NextResponse.json({ message: 'You can only review products you have purchased and received.' }, { status: 400 });
            }
        }

        const alreadyReviewed = product.reviews.find(
            (r: any) => r.user.toString() === user._id.toString()
        );

        if (alreadyReviewed) {
            return NextResponse.json({ message: 'You have already reviewed this product' }, { status: 400 });
        }

        const review = {
            name: user.name,
            rating: Number(rating),
            comment,
            user: user._id,
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) / product.reviews.length;

        await product.save();
        return NextResponse.json({ message: 'Review added' }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<Params> }) {
    try {
        await connectDB();
        const user = await getAuthenticatedUser(request);
        if (!user) {
            return NextResponse.json({ message: 'Not authorized, token failed' }, { status: 401 });
        }

        const { rating, comment } = await request.json();
        const { id } = await params;
        const product = await Product.findById(id);

        if (!product) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        const reviewIndex = product.reviews.findIndex(
            (r: any) => r.user.toString() === user._id.toString()
        );

        if (reviewIndex !== -1) {
            product.reviews[reviewIndex].rating = Number(rating);
            product.reviews[reviewIndex].comment = comment;
            product.reviews[reviewIndex].name = user.name;

            product.rating =
                product.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) /
                product.reviews.length;

            await product.save();
            return NextResponse.json({ message: 'Review updated' });
        } else {
            return NextResponse.json({ message: 'Review not found' }, { status: 404 });
        }
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<Params> }) {
    try {
        await connectDB();
        const user = await getAuthenticatedUser(request);
        if (!user) {
            return NextResponse.json({ message: 'Not authorized, token failed' }, { status: 401 });
        }

        const { id } = await params;
        const product = await Product.findById(id);

        if (!product) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        const reviewIndex = product.reviews.findIndex(
            (r: any) => r.user.toString() === user._id.toString()
        );

        if (reviewIndex !== -1) {
            product.reviews.splice(reviewIndex, 1);
            product.numReviews = product.reviews.length;
            
            if (product.reviews.length > 0) {
                product.rating =
                    product.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) /
                    product.reviews.length;
            } else {
                product.rating = 0;
            }

            await product.save();
            return NextResponse.json({ message: 'Review deleted' });
        } else {
            return NextResponse.json({ message: 'Review not found' }, { status: 404 });
        }
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
