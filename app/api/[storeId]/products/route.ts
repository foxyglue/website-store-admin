import db from "@/lib/db";
import { useAuth } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Search } from 'lucide-react';

export async function POST(req: Request, 
    {params}: {params: {storeId: string}} // params adalah parameter yang dikirimkan dari url; dapat dr nama folder [storeId]
) {
    try {
        const { userId } = await auth()
        const body = await req.json();

        const {name, price, categoryId, images, isFeatured, isArchived} = body

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        if (!name) {
            return new NextResponse('Nama produk Perlu diisi', { status: 400 });
        }
        if (!images || !images.length) {
            return new NextResponse('Image produk Perlu diisi', { status: 400 });
        }
        if (!price) {
            return new NextResponse('Harga produk Perlu diisi', { status: 400 });
        }
        if (!categoryId) {
            return new NextResponse('Kategori produk Perlu diisi', { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse('Store ID dibutuhkan', { status: 400 });
        }

        // cek apakah userId yang login adalah pemilik toko sehingga tidak bisa mengakses toko orang lain
        const storeByUserId = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId: userId
            }
        })

        if (!storeByUserId) {
            return new NextResponse('Unauthorized', { status: 403 });
        }

        const product = await db.product.create({
            data: {
                name,
                price,
                categoryId,
                isFeatured,
                isArchived,
                storeId: params.storeId,
                images: { //karena ngambil dr model lain maka tambahkan object images
                    createMany: {
                        data: [
                            ...images.map((image: {url: string}) => image) // ambil url dari images
                        ]
                    }
                }
            }
        })

        return NextResponse.json(product); // next response ini adalah untuk mengembalikan response ke client

    } catch (error) {
        console.log('[PRODUCT_POST]', error);
        return new NextResponse('Internal error', { status: 500 });
        
    }
}


export async function GET(req: Request, 
    {params}: {params: {storeId: string}} // params adalah parameter yang dikirimkan dari url; dapat dr nama folder [storeId]
) {
    try {

        const { searchParams } = new URL(req.url); // ambil search params dari url
        const categoryId = searchParams.get('categoryId') || undefined; // ambil categoryId dari search params
        const isFeatured = searchParams.get('isFeatured')

        if (!params.storeId) {
            return new NextResponse('Store ID dibutuhkan', { status: 400 });
        }

        // cari product berdasarkan storeId
        const products = await db.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId: categoryId,
                isFeatured: isFeatured ? true : undefined, 
                isArchived: false // hanya ambil product yang tidak diarsipkan
            },
            include:{
                images: true,
                category: true
            },
            orderBy: {
                createdAt: "desc" // dr yang terbaru ke yang lama
            }
        })

        return NextResponse.json(products); // next response ini adalah untuk mengembalikan response ke client

    } catch (error) {
        console.log('[PRODUCTS_GET]', error);
        return new NextResponse('Internal error', { status: 500 });
        
    }
}