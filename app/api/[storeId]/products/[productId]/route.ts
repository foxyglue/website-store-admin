import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET (
    req: Request,
    { params }: {params: { productId: string}} 
    // knp bisa akses params? krn nama foldernya [productId], kalau dikasih [] maka kita bisa akses 
    // individual params yg ada di url
) {
    try {

        if (!params.productId){
            return new NextResponse("Product id dibutuhkan", {status: 400})
        }

        const product = await db.product.findUnique({
            where:{
                id: params.productId,
            },
            include:{
                images: true, // ambil data images juga
                category: true, 
            }
        })

        return NextResponse.json(product);
        
    } catch (error) {
        console.log("[PRODUCT_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// Update
export async function PATCH (
    req: Request,
    { params }: {params: { storeId: string, productId: string}} 
    // knp bisa akses params? krn nama foldernya [storeId] sama [productId], kalau dikasih [] maka kita bisa akses 
    // individual params yg ada di url
) {
    try {
        const {userId} = await auth()
        const body = await req.json()

        const {name, price, categoryId, images, isFeatured, isArchived} = body

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
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

        if (!params.productId){
            return new NextResponse("Product id dibutuhkan", {status: 400})
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

        await db.product.update({
            where:{
                id: params.productId,
            },
            data:{
                name, 
                price,
                isFeatured,
                isArchived,
                categoryId,
                images: {
                    deleteMany: {}
                },
            }
        })

        const product = await db.product.update({
            where:{
                id: params.productId,
            },
            data: {
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: {url: string}) => image) // ambil url dari images
                        ]
                    }
                }
            }
        })

        return NextResponse.json(product);
        
    } catch (error) {
        console.log("[PRODUCT_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// Delete
export async function DELETE (
    req: Request,
    { params }: {params: { storeId: string, productId: string}} 
    // knp bisa akses params? krn nama foldernya [storeId] sama [productId], kalau dikasih [] maka kita bisa akses 
    // individual params yg ada di url
) {
    try {
        const {userId} = await auth()

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!params.productId){
            return new NextResponse("Product id dibutuhkan", {status: 400})
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

        const product = await db.product.deleteMany({
            where:{
                id: params.productId,
            },
        })

        return NextResponse.json(product);
        
    } catch (error) {
        console.log("[PRODUCT_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}