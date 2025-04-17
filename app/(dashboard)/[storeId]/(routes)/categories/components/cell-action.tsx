'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CategoryColumn } from "./columns"
import { Button } from "@/components/ui/button"
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react"
import toast from "react-hot-toast"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import axios from "axios"
import { AlertModal } from "@/components/modals/alert-modal"

interface CellActionProps {
    data: CategoryColumn
}

export const CellAction: React.FC<CellActionProps>= ({
    data
}) => {

    const router = useRouter()
    const params = useParams()

    const [loading, setLoading] = useState(false) 
    const [open, setOpen] = useState(false) // untuk menampilkan modal konfirmasi hapus

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id) // untuk menyalin text ke clipboard
        toast.success("categoryId copied to clipboard") 
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/categories/${data.id}`) //kirim data ke folder api/stores/[storeId]/categories/[categoryId] (logic api ini ada disitu)
            router.refresh()
            router.push(`/${params.storeId}/categories`) // setelah dihapus, redirect ke halaman utama; push untuk navigasi ke halaman lain
            toast.success("Berhasil menghapus kategori")
        } catch (error) {
            toast.error("Gagal menghapus kategori, cek kembali data dan koneksi anda")

        } finally {
            setLoading(false)
            setOpen(false) // menutup modal (popup) setelah selesai
        }
    }


    return (
        <>
        <AlertModal 
        isOpen={open} 
        onClose={() => setOpen(false)} 
        onConfirm={onDelete} 
        loading={loading}/>
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={"secondary"}>
                        <span className="sr-only">Open Menu</span>
                        <MoreHorizontal className="h-4 w-4"/>
                    </Button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                        Actions
                    </DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onCopy(data.id)}>
                        <Copy className="mr-2 h-4 w-4"/>
                        Copy Id
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/categories/${data.id}`)}>
                        <Edit className="mr-2 h-4 w-4"/>
                        Update
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpen(true)}>
                        <Trash className="mr-2 h-4 w-4"/>
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
        </>
    )
}