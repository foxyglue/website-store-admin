import db from "@/lib/db";
import { ProductClient } from "./components/client";
import { ProductColumn } from "./components/columns";
import { format } from "date-fns";
import { formatter } from "@/lib/utils";

const ProductsPage = async ({
    params,
}: {
    params: {storeId: string}
}) => {

    const products = await db.product.findMany({
        where: {
            storeId: params.storeId
        },
        include:{
            category: true // ambil data category juga
        },
        orderBy: {
            createdAt: "desc" // dr yang terbaru ke yang lama
        }
    })

    const formattedProducts: ProductColumn[] = products.map((item) => ({
        id: item.id,
        name: item.name,
        isFeatured: item.isFeatured,
        isArchived: item.isArchived,
        price: formatter.format(item.price.toNumber()), // format harga
        category: item.category.name,

        createdAt: format(item.createdAt, "MMMM do, yyyy"), // format tanggal
    }))

    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductClient data= {formattedProducts}/>

            </div>
        </div>
     );
}
 
export default ProductsPage;