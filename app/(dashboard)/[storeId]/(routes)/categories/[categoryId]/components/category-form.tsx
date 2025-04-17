'use client'

// kenapa ada components di dalam folder settings? karena components ini hanya digunakan di dalam folder settings saja, jadi tidak perlu dibuat folder baru di dalam components.
// jika ada component yang digunakan di beberapa folder, maka buat folder baru di dalam components

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Heading } from "@/components/ui/heading"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { Banner, Category } from "@prisma/client"
import { Trash } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import * as z from "zod"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { AlertModal } from "@/components/modals/alert-modal"
// import { useOrigin } from "@/hooks/use-origin"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


interface CategoryFormProps {
    initialData: Category | null
    banners: Banner[]
}

const formSchema = z.object({
    name: z.string().min(1),
    bannerId: z.string().min(1),
})

type CategoryFormValues = z.infer<typeof formSchema> 
// menyimpan data nama toko yang diambil dari initialData yg dikirim dari page.tsx di '../settings' <CategoryForm initialData={store}/> 

export const CategoryForm: React.FC<CategoryFormProps> = ({ //FC = Function Component
    initialData, banners // parameter CategoryForm
}) => {

    const params = useParams()
    const router = useRouter()
    // const origin = useOrigin() // untuk mendapatkan origin dari url; misal: http://localhost:3000

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false) // state untuk menyimpan data loading

    const title = initialData ? "Edit Category" : "Create Category"
    const description = initialData ? "Edit Category Toko" : "Create Category Toko"
    const toastMessage = initialData ? "Category Berhasil diedit" : "Category Berhasil dibuat"
    const action = initialData ? "Simpan" : "Buat Category"

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema), // untuk memvalidasi data yang masuk ke dalam form
        defaultValues: initialData || {
            name: "",
            bannerId: "",
        }, // data yang akan ditampilkan pada form
    })

    // update atau buat kategori
    const onSubmit = async (data: CategoryFormValues) => {
        try {
            setLoading(true)

            if (initialData) {
                await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, data) 
                
            } else {
                await axios.post(`/api/${params.storeId}/categories`, data) 

            }

            router.refresh()
            router.push(`/${params.storeId}/categories`) // setelah diupdate, redirect ke halaman toko; 
            toast.success(toastMessage)
        } catch {
            toast.error("Cek kembali data yang diinput")
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`) //kirim data ke folder api/stores/[storeId]/categories/[categoryId] (logic api ini ada disitu)
            router.refresh()
            router.push(`/${params.storeId}/categories`) // setelah dihapus, redirect ke halaman utama; push untuk navigasi ke halaman lain
            toast.success("Berhasil menghapus kategori")
        } catch {
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
                <div className="grid grid-cols-3 gap-8">
                    <FormField control={form.control} name="name" 
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Nama</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nama kategori" disabled={loading} {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            //...field adalah object yang berisi data dari input field yang akan diisi oleh user
                        )}
                    />
                    <FormField control={form.control} name="bannerId" 
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Banner</FormLabel>
                                <FormControl>
                                    <Select disabled={loading} onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue 
                                                defaultValue={field.value}
                                                placeholder="Pilih banner"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {banners.map((banner) => (
                                                <SelectItem key={banner.id} value={banner.id}>
                                                    {banner.label}
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