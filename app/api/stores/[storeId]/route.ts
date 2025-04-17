import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Update
export async function PATCH (
    req: Request,
    { params }: {params: { storeId: string}} 
    // knp bisa akses params? krn nama foldernya [storeId], kalau dikasih [] maka kita bisa akses 
    // individual params yg ada di url
) {
    try {
        const {userId} = await auth()
        const body = await req.json()

        const {name} = body

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }
        if (!name){
            return new NextResponse("Harus input nama", {status: 400})
        }

        if (!params.storeId){
            return new NextResponse("Store id dibutuhkan", {status: 400})
        }

        const store = await db.store.updateMany({
            where:{
                id: params.storeId,
                userId: userId
            },
            data:{
                name
            }
        })

        return NextResponse.json(store);
        
    } catch (error) {
        console.log("[STORE_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// Delete
export async function DELETE (
    req: Request,
    { params }: {params: { storeId: string}} 
    // knp bisa akses params? krn nama foldernya [storeId], kalau dikasih [] maka kita bisa akses 
    // individual params yg ada di url
) {
    try {
        const {userId} = await auth()

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!params.storeId){
            return new NextResponse("Store id dibutuhkan", {status: 400})
        }

        const store = await db.store.deleteMany({
            where:{
                id: params.storeId,
                userId: userId
            },
        })

        return NextResponse.json(store);
        
    } catch (error) {
        console.log("[STORE_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}