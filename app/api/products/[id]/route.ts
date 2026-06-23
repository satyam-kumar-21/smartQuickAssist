import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Product from '@/lib/models/Product';
import { getAuthenticatedUser } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';

type Params = {
    id: string;
};

export async function GET(request: Request, { params }: { params: Promise<Params> }) {
    try {
        await connectDB();
        const { id } = await params;
        
        let product;

        if (mongoose.Types.ObjectId.isValid(id)) {
            product = await Product.findById(id).populate('category', 'name');
        } else {
            // Search by exact slug only
            product = await Product.findOne({ slug: id }).populate('category', 'name');
        }

        if (product) {
            return NextResponse.json(product);
        } else {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
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
        const product = await Product.findById(id);

        if (!product) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        const formData = await request.formData();
        
        const title = formData.get('title') as string;
        const brand = formData.get('brand') as string;
        const category = formData.get('category') as string;
        const price = formData.get('price') as string;
        const oldPrice = formData.get('oldPrice') as string;
        const countInStock = formData.get('countInStock') as string;
        const description = formData.get('description') as string;
        const shortDetails = formData.get('shortDetails') as string;
        const shortSpecification = formData.get('shortSpecification') as string;
        const overview = formData.get('overview') as string;
        const technicalSpecification = formData.get('technicalSpecification') as string;
        const color = formData.get('color') as string;
        const width = formData.get('width') as string;
        const height = formData.get('height') as string;
        const depth = formData.get('depth') as string;
        const screenSize = formData.get('screenSize') as string;
        const wireless = formData.get('wireless') as string;

        const technology = formData.get('technology');
        const usageCategory = formData.get('usageCategory');
        const allInOneType = formData.get('allInOneType');
        const mainFunction = formData.get('mainFunction');
        const reviews = formData.get('reviews');

        const parseArrayField = (field: any) => {
            if (!field) return [];
            if (Array.isArray(field)) return field;
            if (typeof field === 'string') {
                try {
                    return JSON.parse(field);
                } catch {
                    return field.split(',').map((v: string) => v.trim()).filter(Boolean);
                }
            }
            return [];
        };

        product.title = title || product.title;
        product.slug = title ? title.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, "-") : product.slug;
        product.brand = brand || product.brand;
        product.category = category || product.category;
        product.price = price !== null ? Number(price) : product.price;
        product.oldPrice = oldPrice !== null ? Number(oldPrice) : product.oldPrice;
        product.countInStock = countInStock !== null ? Number(countInStock) : product.countInStock;
        product.description = description || product.description;
        product.shortDetails = shortDetails !== null ? shortDetails : product.shortDetails;
        product.shortSpecification = shortSpecification !== null ? shortSpecification : product.shortSpecification;
        product.overview = overview !== null ? overview : product.overview;
        product.technicalSpecification = technicalSpecification !== null ? technicalSpecification : product.technicalSpecification;
        product.color = color !== null ? color : product.color;
        product.width = width !== null ? width : product.width;
        product.height = height !== null ? height : product.height;
        product.depth = depth !== null ? depth : product.depth;
        product.screenSize = screenSize !== null ? screenSize : product.screenSize;
        product.wireless = wireless !== null ? wireless : product.wireless;

        if (technology) product.technology = parseArrayField(technology);
        if (usageCategory) product.usageCategory = parseArrayField(usageCategory);
        if (allInOneType) product.allInOneType = parseArrayField(allInOneType);
        if (mainFunction) product.mainFunction = parseArrayField(mainFunction);

        // Image Update Logic
        let currentImages: string[] = [];
        const existingImages = formData.get('existingImages');
        const imagesJson = formData.get('images');

        if (existingImages && typeof existingImages === 'string') {
            try {
                currentImages = JSON.parse(existingImages);
            } catch (err) {
                currentImages = Array.isArray(product.images) ? product.images : [];
            }
        } else if (imagesJson && typeof imagesJson === 'string' && imagesJson.startsWith('[')) {
            try {
                currentImages = JSON.parse(imagesJson);
            } catch {
                currentImages = Array.isArray(product.images) ? product.images : [];
            }
        } else {
            currentImages = Array.isArray(product.images) ? product.images : [];
        }

        const newImageFiles = formData.getAll('images') as File[];
        const uploadedImageUrls: string[] = [];

        if (newImageFiles && newImageFiles.length > 0) {
            for (const file of newImageFiles) {
                if (file.size > 0) {
                    const arrayBuffer = await file.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);
                    const url = await uploadToCloudinary(buffer, file.name);
                    uploadedImageUrls.push(url);
                }
            }
        }

        product.images = [...currentImages, ...uploadedImageUrls];

        if (reviews && typeof reviews === 'string') {
            try {
                const parsedReviews = JSON.parse(reviews);
                product.reviews = parsedReviews;
                product.numReviews = parsedReviews.length;
                product.rating = parsedReviews.length > 0 
                    ? parsedReviews.reduce((acc: number, item: any) => item.rating + acc, 0) / parsedReviews.length 
                    : 0;
            } catch (e) {
                // Ignore
            }
        }

        const updatedProduct = await product.save();
        return NextResponse.json(updatedProduct);
    } catch (error: any) {
        console.error('Error updating product:', error);
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
        const product = await Product.findById(id);

        if (product) {
            await product.deleteOne();
            return NextResponse.json({ message: 'Product removed' });
        } else {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
