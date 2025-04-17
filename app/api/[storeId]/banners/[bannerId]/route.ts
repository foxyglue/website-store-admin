import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET (
    req: Request,
    { params }: {params: { bannerId: string}} 
    // knp bisa akses params? krn nama foldernya [bannerId], kalau dikasih [] maka kita bisa akses 
    // individual params yg ada di url
) {
    try {

        if (!params.bannerId){
            return new NextResponse("Store id dibutuhkan", {status: 400})
        }

        const banner = await db.banner.findUnique({
            where:{
                id: params.bannerId,
            },
        })

        return NextResponse.json(banner);
        
    } catch (error) {
        console.log("[BANNER_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// Update
export async function PATCH (
    req: Request,
    { params }: {params: { storeId: string, bannerId: string}} 
    // knp bisa akses params? krn nama foldernya [storeId] sama [bannerId], kalau dikasih [] maka kita bisa akses 
    // individual params yg ada di url
) {
    try {
        const {userId} = await auth()
        const body = await req.json()

        const {label, imageUrl} = body

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }
        if (!label){
            return new NextResponse("Harus input label", {status: 400})
        }
        if (!imageUrl){
            return new NextResponse("Harus input imageUrl", {status: 400})
        }

        if (!params.bannerId){
            return new NextResponse("Banner id dibutuhkan", {status: 400})
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

        const banner = await db.banner.updateMany({
            where:{
                id: params.bannerId,
            },
            data:{
                label, 
                imageUrl,
            }
        })

        return NextResponse.json(banner);
        
    } catch (error) {
        console.log("[BANNER_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// Delete
export async function DELETE (
    req: Request,
    { params }: {params: { storeId: string, bannerId: string}} 
    // knp bisa akses params? krn nama foldernya [storeId] sama [bannerId], kalau dikasih [] maka kita bisa akses 
    // individual params yg ada di url
) {
    try {
        const {userId} = await auth()

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!params.bannerId){
            return new NextResponse("Store id dibutuhkan", {status: 400})
        }

        const storeByUserId = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId: userId
            }
        })

        if (!storeByUserId) {
            return new NextResponse('Unauthorized', { status: 403 });
        }

        const banner = await db.banner.deleteMany({
            where:{
                id: params.bannerId,
            },
        })

        return NextResponse.json(banner);
        
    } catch (error) {
        console.log("[BANNER_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}