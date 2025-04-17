import db from "@/lib/db";
import { useAuth } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request, 
    {params}: {params: {storeId: string}} // params adalah parameter yang dikirimkan dari url; dapat dr nama folder [storeId]
) {
    try {
        const { userId } = await auth()
        const body = await req.json();

        const {name, bannerId} = body

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        if (!name) {
            return new NextResponse('Name kategori Perlu diisi', { status: 400 });
        }
        if (!bannerId) {
            return new NextResponse('bannerId Perlu diisi', { status: 400 });
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

        const category = await db.category.create({
            data: {
                name,
                bannerId,
                storeId: params.storeId
            }
        })

        return NextResponse.json(category); // next response ini adalah untuk mengembalikan response ke client

    } catch (error) {
        console.log('[CATEGORIES_POST]', error);
        return new NextResponse('Internal error', { status: 500 });
        
    }
}



export async function GET(req: Request, 
    {params}: {params: {storeId: string}} // params adalah parameter yang dikirimkan dari url; dapat dr nama folder [storeId]
) {
    try {

        if (!params.storeId) {
            return new NextResponse('Store ID dibutuhkan', { status: 400 });
        }

        // cari banner berdasarkan storeId
        const categories = await db.category.findMany({
            where: {
                storeId: params.storeId
            }
        })

        return NextResponse.json(categories); // next response ini adalah untuk mengembalikan response ke client

    } catch (error) {
        console.log('[CATEGORIES_GET]', error);
        return new NextResponse('Internal error', { status: 500 });
        
    }
}