'use client'

// import { Button } from "@/components/ui/button"
// import Modal from "@/components/ui/modal";
import { useStoreModal } from "@/hooks/use-store-modal";
// import { UserButton } from "@clerk/nextjs";
import { useEffect } from "react";

const SetupPage = () => {
    
    const onOpen = useStoreModal((state) => state.onOpen) // fungsi untuk membuka modal 
    const isOpen = useStoreModal((state) => state.isOpen) // state adalah untuk menyimpan data apakah modal terbuka atau tidak

    useEffect(() => {
        if (!isOpen) {
            onOpen()
        }
    }, [isOpen, onOpen]) // jika isOpen berubah, maka onOpen akan dipanggil

  return null
}

export default SetupPage;
