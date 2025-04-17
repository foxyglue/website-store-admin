'use client'

// kenapa ada components di dalam folder settings? karena components ini hanya digunakan di dalam folder settings saja, jadi tidak perlu dibuat folder baru di dalam components.
// jika ada component yang digunakan di beberapa folder, maka buat folder baru di dalam components

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Heading } from "@/components/ui/heading"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { Category, Image, Product } from "@prisma/client"
import { Trash } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import * as z from "zod"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { AlertModal } from "@/components/modals/alert-modal"
import { ApiAlert } from "@/components/ui/api-alert"
import { useOrigin } from "@/hooks/use-origin"
import ImageUpload from "@/components/ui/image-upload"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"


interface ProductFormProps {
    initialData: | (Product & {
        images: Image[] // menambahkan images ke dalam initialData
    }) | null;
    categories: Category[]
}

const formSchema = z.object({
    name: z.string().min(1),
    images: z.object({
        url: z.string(),
    }).array(),
    price: z.coerce.number().min(1),
    categoryId: z.string().min(1),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional(),
})

type ProductFormValues = z.infer<typeof formSchema> 
// menyimpan data nama toko yang diambil dari initialData yg dikirim dari page.tsx di '../settings' <ProductForm initialData={store}/> 

export const ProductForm: React.FC<ProductFormProps> = ({ //FC = Function Component
    initialData, // parameter ProductForm
    categories
}) => {

    const params = useParams()
    const router = useRouter()
    const origin = useOrigin() // untuk mendapatkan origin dari url; misal: http://localhost:3000

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false) // state untuk menyimpan data loading

    const title = initialData ? "Edit Product" : "Create Product"
    const description = initialData ? "Edit Product Toko" : "Create Product Toko"
    const toastMessage = initialData ? "Product Berhasil diedit" : "Product Berhasil dibuat"
    const action = initialData ? "Simpan" : "Buat Product"

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema), // untuk memvalidasi data yang masuk ke dalam form
        defaultValues: initialData ? {
            ...initialData,
            price: parseFloat(String(initialData?.price)), // mengubah price menjadi number dr secimal
        }: {
            name: "",
            images: [],
            price: 0,
            categoryId: "",
            isFeatured: false,
            isArchived: false,

        }, // data yang akan ditampilkan pada form
    })

    // update nama toko
    const onSubmit = async (data: ProductFormValues) => {
        try {
            setLoading(true)

            if (initialData) {
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data) 
                
            } else {
                await axios.post(`/api/${params.storeId}/products`, data) 

            }

            router.refresh()
            router.push(`/${params.storeId}/products`) // setelah diupdate, redirect ke halaman toko; 
            toast.success(toastMessage)
        } catch (error) {
            toast.error("Cek kembali data yang diinput")
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`) //kirim data ke folder api/stores/[storeId]/products/[bannerId] (logic api ini ada disitu)
            router.refresh()
            router.push(`/${params.storeId}/products`) // setelah dihapus, redirect ke halaman utama; push untuk navigasi ke halaman lain
            toast.success("Berhasil menghapus produk")
        } catch (error) {
            toast.error("Gagal menghapus toko, cek kembali data dan koneksi anda")

        } finally {
            setLoading(false)
            setOpen(false) // menutup modal (popup) setelah selesai
        }
    }

    return (
        <>
        <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading}/>

        <div className="flex items-center justify-between">
            <Heading title={title} description={description}/>
            {initialData && (
                <Button variant={"destructive"} size={"sm"} onClick={() => setOpen(true)} disabled={loading}>
                    <Trash className=" h-4 w-4"/>
                </Button>
            )}
        </div>

        <Separator className="my-4"/>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
            <FormField control={form.control} name="images" 
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Images</FormLabel>
                                <FormControl>
                                    <ImageUpload disabled={loading} 
                                        onChange={(url) => field.onChange([...field.value, {url}])}
                                        onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}
                                        value={field.value.map((image) => image.url)} 
                                        // jika field.value ada, maka masukkan ke dalam array, jika tidak ada, maka masukkan array kosong
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                <div className="grid grid-cols-3 gap-8">
                    <FormField control={form.control} name="name" 
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Label</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nama produk" disabled={loading} {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            //...field adalah object yang berisi data dari input field yang akan diisi oleh user
                        )}
                    />
                    <FormField control={form.control} name="price" 
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Harga</FormLabel>
                                <FormControl>
                                    <Input placeholder="Rp" disabled={loading} {...field} type="number"/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            //...field adalah object yang berisi data dari input field yang akan diisi oleh user
                        )}
                    />
                    <FormField control={form.control} name="categoryId" 
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Banner</FormLabel>
                                <FormControl>
                                    <Select disabled={loading} onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue 
                                                defaultValue={field.value}
                                                placeholder="Pilih kategori"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            //...field adalah object yang berisi data dari input field yang akan diisi oleh user
                        )}
                    />
                    <FormField control={form.control} name="isFeatured" 
                        render={({field}) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox 
                                        checked={field.value}
                                        onCheckedChange={field.onChange} // mengubah value dari checkbox

                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Featured</FormLabel>
                                    <FormDescription>Produk ini akan muncul di Home page</FormDescription>
                                </div>
                            </FormItem>
                            //...field adalah object yang berisi data dari input field yang akan diisi oleh user
                        )}
                    />
                    <FormField control={form.control} name="isArchived" 
                        render={({field}) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox 
                                        checked={field.value}
                                        onCheckedChange={field.onChange} // mengubah value dari checkbox

                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Archived</FormLabel>
                                    <FormDescription>Produk ini akan disembunyikan dari toko</FormDescription>
                                </div>
                            </FormItem>
                            //...field adalah object yang berisi data dari input field yang akan diisi oleh user
                        )}
                    />

                </div>
                <Button disabled={loading} className="ml-auto" type="submit">
                    {action}
                </Button>
            </form>
        </Form>
        
        <Separator />

        </>
    )
}