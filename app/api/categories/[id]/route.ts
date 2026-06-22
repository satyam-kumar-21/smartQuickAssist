import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Category from '@/lib/models/Category';
import { getAuthenticatedUser } from '@/lib/auth';

type Params = {
    id: string;
};

export async function GET(request: Request, { params }: { params: Promise<Params> }) {
    try {
        await connectDB();
        const { id } = await params;
        const category = await Category.findById(id);
        if (category) {
            return NextResponse.json(category);
        } else {
            return NextResponse.json({ message: 'Category not found' }, { status: 404 });
        }
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<Params> }) {
    try {
        await connectDB();
        const adminUser = await getAuthenticatedUser(request);
        if (!adminUser || !adminUser.isAdmin) {
            return NextResponse.json({ message: 'Not authorized as an admin' }, { status: 401 });
        }

        const { id } = await params;
        const { name, slug, image, description } = await request.json();
        const category = await Category.findById(id);

        if (category) {
            category.name = name || category.name;
            category.slug = slug || category.slug;
            category.image = image || category.image;
            category.description = description || category.description;

            const updatedCategory = await category.save();
            return NextResponse.json(updatedCategory);
        } else {
            return NextResponse.json({ message: 'Category not found' }, { status: 404 });
        }
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<Params> }) {
    try {
        await connectDB();
        const adminUser = await getAuthenticatedUser(request);
        if (!adminUser || !adminUser.isAdmin) {
            return NextResponse.json({ message: 'Not authorized as an admin' }, { status: 401 });
        }

        const { id } = await params;
        const category = await Category.findById(id);
        if (category) {
            await category.deleteOne();
            return NextResponse.json({ message: 'Category removed' });
        } else {
            return NextResponse.json({ message: 'Category not found' }, { status: 404 });
        }
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
