import db from "@/lib/db";
import { CategoryForm } from "./components/category-form";

const CategoryPage = async ({
    params
}: {
    params: {
        categoryId: string, // drmn categoryId ini? karena kita bikin folder [categoryId] di dalam folder categorys
        storeId: string
    }
}) => {
    const category = await db.category.findUnique({
        where: {
            id: params.categoryId,
        }
    })

    const banners = await db.banner.findMany({
        where: {
            storeId: params.storeId,
        },
    })

    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CategoryForm 
                initialData={category} 
                banners={banners}/>
            </div>
        </div>
     );
}
 
export default CategoryPage;