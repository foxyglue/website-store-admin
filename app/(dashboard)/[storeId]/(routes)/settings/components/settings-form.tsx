'use client'

// kenapa ada components di dalam folder settings? karena components ini hanya digunakan di dalam folder settings saja, jadi tidak perlu dibuat folder baru di dalam components.
// jika ada component yang digunakan di beberapa folder, maka buat folder baru di dalam components

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Heading } from "@/components/ui/heading"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { Store } from "@prisma/client"
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


interface SettingsFormProps {
    initialData: Store
}

const formSchema = z.object({
    name: z.string().min(1),
})

type SettingFormValues = z.infer<typeof formSchema> 
// menyimpan data nama toko yang diambil dari initialData yg dikirim dari page.tsx di '../settings' <SettingsForm initialData={store}/> 

export const SettingsForm: React.FC<SettingsFormProps> = ({ //FC = Function Component
    initialData // parameter settingsform; jd semua data yg masuk melalui schema validation
}) => {

    const params = useParams()
    const router = useRouter()
    const origin = useOrigin() // untuk mendapatkan origin dari url; misal: http://localhost:3000

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false) // state untuk menyimpan data loading

    const form = useForm<SettingFormValues>({
        resolver: zodResolver(formSchema), // untuk memvalidasi data yang masuk ke dalam form
        defaultValues: initialData, // data yang akan ditampilkan pada form
    })

    // update nama toko
    const onSubmit = async (data: SettingFormValues) => {
        try {
            setLoading(true)
            await axios.patch(`/api/stores/${params.storeId}`, data) //kirim data ke folder api/stores/[storeId]/route.ts (logic api ini ada disitu)
            router.refresh()
            toast.success("Berhasil mengupdate nama toko")
        } catch (error) {
            toast.error("Cek kembali data yang diinput")
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/stores/${params.storeId}`) //kirim data ke folder api/stores/[storeId]/route.ts (logic api ini ada disitu)
            router.refresh()
            router.push("/") // setelah dihapus, redirect ke halaman utama; push untuk navigasi ke halaman lain
            toast.success("Berhasil menghapus toko")
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

        <div className="flex items-center justify-between" title="Settings">
            <Heading title="Settings" description="Atur Toko"/>
            <Button variant={"destructive"} size={"sm"} onClick={() => setOpen(true)} disabled={loading}>
                <Trash className=" h-4 w-4"/>
            </Button>
        </div>

        <Separator className="my-4"/>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                <div className="grid grid-cols-3 gap-8">
                    <FormField control={form.control} name="name" render={({field}) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Nama Toko" disabled={loading} {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                        //...field adalah object yang berisi data dari input field yang akan diisi oleh user
                    )}/>
                </div>
                <Button disabled={loading} className="ml-auto" type="submit">
                    Save
                </Button>
            </form>
        </Form>
        
        <Separator />

        <ApiAlert title="PUBLIC_API_URL" description={`${origin}/api/${params.storeId}`} variant="public"/>
        </>
    )
}