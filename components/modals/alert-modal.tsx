'use client'

import React, { useEffect, useState } from "react"
import Modal from "../ui/modal"
import { Button } from "../ui/button"

interface AlertModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    loading: boolean
}

export const AlertModal: React.FC<AlertModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    loading
}) => {
    const [isMounted, setIsMounted] = useState(false)

    // untuk mengecek apakah component sudah di mount atau belum; mount adalah proses ketika component sudah ditampilkan di browser
    useEffect(() => {
        setIsMounted(true)
    }
    , [])

    // jika berjalan di server side, maka tidak akan menampilkan modal
    if (!isMounted) {
        return null
    }

    return (
        <Modal title="Apakah anda yakin?" description="Anda tidak dapat mengembalikan data yang sudah dihapus" isOpen={isOpen} onClose={onClose}>
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button disabled={loading} variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button disabled={loading} variant="destructive" onClick={onConfirm}> 
                    Confirm
                </Button>
            </div>
        </Modal>
        // disabled jika loading true 
    )
}