import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Category from '@/lib/models/Category';
import Product from '@/lib/models/Product';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET() {
    try {
        await connectDB();
        const categories = await Category.find({});
        
        // Enrich with product counts
        const categoriesWithCounts = await Promise.all(categories.map(async (cat) => {
            const count = await Product.countDocuments({ category: cat._id });
            return {
                ...cat.toObject(),
                count
            };
        }));

        return NextResponse.json(categoriesWithCounts);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const adminUser = await getAuthenticatedUser(request);
        if (!adminUser || !adminUser.isAdmin) {
            return NextResponse.json({ message: 'Not authorized as an admin' }, { status: 401 });
        }

        const { name, slug, image, description } = await request.json();
        
        if (!name) {
            return NextResponse.json({ message: 'Category name is required' }, { status: 400 });
        }

        const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, '-');

        const category = new Category({
            name,
            slug: generatedSlug,
            image,
            description
        });

        const createdCategory = await category.save();
        return NextResponse.json(createdCategory, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
