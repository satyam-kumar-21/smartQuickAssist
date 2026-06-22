import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/lib/models/Product';
import Category from '@/lib/models/Category';
import { getAuthenticatedUser } from '@/lib/auth';
import XLSX from 'xlsx';

export async function POST(request: Request) {
    try {
        await connectDB();
        const adminUser = await getAuthenticatedUser(request);
        if (!adminUser || !adminUser.isAdmin) {
            return NextResponse.json({ message: 'Not authorized as an admin' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('excelFile') as File;

        if (!file) {
            return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

        const products = [];
        const errors = [];

        for (let i = 0; i < jsonData.length; i++) {
            const row = jsonData[i];
            try {
                const categoryName = row.category || row.Category;
                let category = null;
                if (categoryName) {
                    category = await Category.findOne({ name: { $regex: new RegExp(`^${categoryName}$`, 'i') } });
                }

                if (!category) {
                    errors.push(`Row ${i + 2}: Category "${categoryName}" not found`);
                    continue;
                }

                const productData: any = {
                    user: adminUser._id,
                    brand: row.brand || row.Brand || '',
                    title: row.title || row.Title || row.name || row.Name || '',
                    category: category._id,
                    description: row.description || row.Description || '',
                    price: parseFloat(row.price || row.Price || 0),
                    oldPrice: parseFloat(row.oldPrice || row['Old Price'] || 0),
                    countInStock: parseInt(row.countInStock || row['Count In Stock'] || row.stock || row.Stock || 0),
                    shortDetails: row.shortDetails || row['Short Details'] || '',
                    shortSpecification: row.shortSpecification || row['Short Specification'] || '',
                    overview: row.overview || row.Overview || '',
                    technicalSpecification: row.technicalSpecification || row['Technical Specification'] || '',
                    color: row.color || row.Color || '',
                    width: row.width || row.Width || '',
                    height: row.height || row.Height || '',
                    depth: row.depth || row.Depth || '',
                    screenSize: row.screenSize || row['Screen Size'] || '',
                    images: []
                };

                const slug = (productData.title || `product-${Date.now()}-${i}`).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                productData.slug = slug;

                const product = new Product(productData);
                products.push(product);
            } catch (error: any) {
                errors.push(`Row ${i + 2}: ${error.message}`);
            }
        }

        if (products.length > 0) {
            await Product.insertMany(products);
        }

        return NextResponse.json({
            message: `Successfully uploaded ${products.length} products`,
            errors: errors.length > 0 ? errors : undefined
        });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
