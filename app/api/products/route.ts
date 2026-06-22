import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/lib/models/Product';
import Category from '@/lib/models/Category';
import { getAuthenticatedUser } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        
        const categoryName = searchParams.get('category');
        const search = searchParams.get('search');
        const brand = searchParams.get('brand');
        const sort = searchParams.get('sort');
        const technology = searchParams.get('technology');
        const usageCategory = searchParams.get('usageCategory');
        const allInOneType = searchParams.get('allInOneType');
        const wireless = searchParams.get('wireless');
        const mainFunction = searchParams.get('mainFunction');

        let query: any = {};
        
        if (categoryName && categoryName !== 'undefined' && categoryName !== 'null') {
            const category = await Category.findOne({ name: { $regex: new RegExp(`^${categoryName}$`, 'i') } });
            if (category) {
                query.category = category._id;
            } else {
                return NextResponse.json({ products: [], page: 1, pages: 0, total: 0 });
            }
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { shortDetails: { $regex: search, $options: 'i' } },
                { shortSpecification: { $regex: search, $options: 'i' } },
                { overview: { $regex: search, $options: 'i' } },
                { technicalSpecification: { $regex: search, $options: 'i' } },
                { brand: { $regex: search, $options: 'i' } },
                { color: { $regex: search, $options: 'i' } },
                { width: { $regex: search, $options: 'i' } },
                { height: { $regex: search, $options: 'i' } },
                { depth: { $regex: search, $options: 'i' } },
                { screenSize: { $regex: search, $options: 'i' } }
            ];
        }

        if (technology) {
            query.technology = technology;
        }
        if (usageCategory) {
            query.usageCategory = { $in: usageCategory.split(',') };
        }
        if (allInOneType) {
            query.allInOneType = allInOneType;
        }
        if (wireless) {
            query.wireless = wireless;
        }
        if (mainFunction) {
            query.mainFunction = { $in: mainFunction.split(',') };
        }

        if (brand && brand !== 'undefined' && brand !== 'null') {
            query.brand = { $regex: brand, $options: 'i' };
        }

        let sortOption: any = {};
        if (sort === 'lowToHigh') {
            sortOption.price = 1;
        } else if (sort === 'highToLow') {
            sortOption.price = -1;
        } else {
            sortOption.createdAt = -1;
        }

        const pageSize = Number(searchParams.get('limit')) || 20;
        const page = Number(searchParams.get('page')) || 1;

        const count = await Product.countDocuments(query);
        const products = await Product.find(query)
            .populate('category', 'name')
            .sort(sortOption)
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        return NextResponse.json({ products, page, pages: Math.ceil(count / pageSize), total: count });
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

        if (!title || !price || !category) {
            return NextResponse.json({ message: 'Please provide title, price, and category' }, { status: 400 });
        }

        // Upload images to Cloudinary
        const imageUrls: string[] = [];
        const imageFiles = formData.getAll('images') as File[];

        if (imageFiles && imageFiles.length > 0) {
            for (const file of imageFiles) {
                if (file.size > 0) {
                    const arrayBuffer = await file.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);
                    const url = await uploadToCloudinary(buffer, file.name);
                    imageUrls.push(url);
                }
            }
        }

        // If simple images array is passed as stringified JSON in body
        const jsonImages = formData.get('imagesJson');
        if (jsonImages && typeof jsonImages === 'string') {
            try {
                const parsed = JSON.parse(jsonImages);
                if (Array.isArray(parsed)) {
                    imageUrls.push(...parsed);
                }
            } catch (e) {
                // Ignore
            }
        }

        let parsedReviews = [];
        if (reviews && typeof reviews === 'string') {
            try {
                parsedReviews = JSON.parse(reviews);
            } catch (e) {
                // Ignore
            }
        }

        const slug = title.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, "-");

        const product = new Product({
            user: adminUser._id,
            title,
            slug,
            brand: brand || 'Generic',
            category,
            price: Number(price) || 0,
            oldPrice: oldPrice ? Number(oldPrice) : 0,
            countInStock: Number(countInStock) || 0,
            description: description || '',
            shortDetails,
            shortSpecification,
            overview,
            technicalSpecification,
            images: imageUrls,
            color, width, height, depth, screenSize,
            reviews: parsedReviews,
            numReviews: parsedReviews.length,
            rating: parsedReviews.length > 0
                ? parsedReviews.reduce((acc: number, item: any) => item.rating + acc, 0) / parsedReviews.length
                : 0,
            technology: parseArrayField(technology),
            usageCategory: parseArrayField(usageCategory),
            allInOneType: parseArrayField(allInOneType),
            wireless: wireless || '',
            mainFunction: parseArrayField(mainFunction)
        });

        const createdProduct = await product.save();
        return NextResponse.json(createdProduct, { status: 201 });
    } catch (error: any) {
        console.error('Error creating product:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
