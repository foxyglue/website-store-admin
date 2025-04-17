'use client'

import Modal from "../ui/modal"
import { useStoreModal} from '../../hooks/use-store-modal';
import * as z from 'zod'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const formSchema = z.object({
    name: z.string().min(1),

})

export const StoreModal = () => {
    const storeModal = useStoreModal()

    const [Loading, setLoading] = useState(false)
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    })

    // ketika form disubmit, maka akan memanggil fungsi onSubmit yang akan mengirimkan data ke server
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true)

            const response = await axios.post("/api/stores", values) // mengirimkan data ke server dengan method POST
            console.log(response.data)
            toast.success("Berhasil Membuat Toko")
            window.location.assign(`/${response.data.id}`) // jika berhasil, maka akan diarahkan ke halaman dashboard dengan id toko yang baru dibuat

        } catch (error) {
            toast.error("Gagal Membuat Toko")
            console.log("Error: ", error)
        }    
        finally{
            setLoading(false)
        }
    } 

    return (
        <Modal title={"Buat Store"} description={"Tambahkan store untuk membuat produk dan kategori"} 
        isOpen={storeModal.isOpen} onClose={storeModal.onClose}>
            <div>
                <div className="space-y-4 py-2 pb-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField 
                            control={form.control}
                            name="name"
                            render={({field}) => ( //untuk menampilkan input field pada form yang dapat diisi oleh user
                                // field adalah object yang berisi data dari input field yang akan diisi oleh user
                                <FormItem>
                                    <FormLabel className="text-sm">Nama Toko</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nama Toko" {...field} disabled={Loading}/>
                                         
                                        {/* jika loading true maka input field tidak dapat diisi */}
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                                <Button variant={"outline"} onClick={storeModal.onClose}> Cancel </Button>
                                <Button disabled={Loading} type="submit"> Continue </Button>
                            </div>
                        </form> 
                    </Form> 
                </div>
            </div>
        </Modal>
    )
}