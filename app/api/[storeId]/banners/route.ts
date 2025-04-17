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

        const {label, imageUrl} = body

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        if (!label) {
            return new NextResponse('Name banner Perlu diisi', { status: 400 });
        }
        if (!imageUrl) {
            return new NextResponse('Image banner Perlu diisi', { status: 400 });
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

        const banner = await db.banner.create({
            data: {
                label,
                imageUrl,
                storeId: params.storeId
            }
        })

        return NextResponse.json(banner); // next response ini adalah untuk mengembalikan response ke client

    } catch (error) {
        console.log('[BANNERS_POST]', error);
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
        const banner = await db.banner.findMany({
            where: {
                storeId: params.storeId
            }
        })

        return NextResponse.json(banner); // next response ini adalah untuk mengembalikan response ke client

    } catch (error) {
        console.log('[BANNERS_GET]', error);
        return new NextResponse('Internal error', { status: 500 });
        
    }
}