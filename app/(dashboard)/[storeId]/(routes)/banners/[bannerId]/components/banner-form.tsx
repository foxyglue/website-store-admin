'use client'

// kenapa ada components di dalam folder settings? karena components ini hanya digunakan di dalam folder settings saja, jadi tidak perlu dibuat folder baru di dalam components.
// jika ada component yang digunakan di beberapa folder, maka buat folder baru di dalam components

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Heading } from "@/components/ui/heading"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { Banner } from "@prisma/client"
import { Trash } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import * as z from "zod"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { AlertModal } from "@/components/modals/alert-modal"
// import { useOrigin } from "@/hooks/use-origin"
import ImageUpload from "@/components/ui/image-upload"


interface BannerFormProps {
    initialData: Banner | null
}

const formSchema = z.object({
    label: z.string().min(1),
    imageUrl: z.string().min(1),
})

type BannerFormValues = z.infer<typeof formSchema> 
// menyimpan data nama toko yang diambil dari initialData yg dikirim dari page.tsx di '../settings' <BannerForm initialData={store}/> 

export const BannerForm: React.FC<BannerFormProps> = ({ //FC = Function Component
    initialData // parameter BannerForm
}) => {

    const params = useParams()
    const router = useRouter()
    // const origin = useOrigin() // untuk mendapatkan origin dari url; misal: http://localhost:3000

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false) // state untuk menyimpan data loading

    const title = initialData ? "Edit Banner" : "Create Banner"
    const description = initialData ? "Edit Banner Toko" : "Create Banner Toko"
    const toastMessage = initialData ? "Banner Berhasil diedit" : "Banner Berhasil dibuat"
    const action = initialData ? "Simpan" : "Buat Banner"

    const form = useForm<BannerFormValues>({
        resolver: zodResolver(formSchema), // untuk memvalidasi data yang masuk ke dalam form
        defaultValues: initialData || {
            label: "",
            imageUrl: "",
        }, // data yang akan ditampilkan pada form
    })

    // update nama toko
    const onSubmit = async (data: BannerFormValues) => {
        try {
            setLoading(true)

            if (initialData) {
                await axios.patch(`/api/${params.storeId}/banners/${params.bannerId}`, data) 
                
            } else {
                await axios.post(`/api/${params.storeId}/banners`, data) 

            }

            router.refresh()
            router.push(`/${params.storeId}/banners`) // setelah diupdate, redirect ke halaman toko; 
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
            await axios.delete(`/api/${params.storeId}/banners/${params.bannerId}`) //kirim data ke folder api/stores/[storeId]/banners/[bannerId] (logic api ini ada disitu)
            router.refresh()
            router.push(`/${params.storeId}/banners`) // setelah dihapus, redirect ke halaman utama; push untuk navigasi ke halaman lain
            toast.success("Berhasil menghapus banner")
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
                    <FormField control={form.control} name="label" 
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Label</FormLabel>
                                <FormControl>
                                    <Input placeholder="Label banner" disabled={loading} {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            //...field adalah object yang berisi data dari input field yang akan diisi oleh user
                        )}
                    />

                    <FormField control={form.control} name="imageUrl" 
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Image</FormLabel>
                                <FormControl>
                                    <ImageUpload disabled={loading} 
                                        onChange={(url) => field.onChange(url)}
                                        onRemove={() => field.onChange()}
                                        value={field.value ? [field.value] : []} 
                                        // jika field.value ada, maka masukkan ke dalam array, jika tidak ada, maka masukkan array kosong
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
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