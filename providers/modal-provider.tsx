'use client'

import { StoreModal } from '@/components/modals/store-modal'
import { useState, useEffect } from 'react'

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false) 
    //untuk mengecek apakah komponen sudah dimounting atau belum (mounting adalah proses ketika komponen ditambahkan ke dalam DOM)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    // jika komponen belum dimounting, maka tidak akan merender apapun (null)
    if (!isMounted) {
        return null
    }
    // jika sudah dimounting, maka akan merender komponen StoreModal
    return (
        <>
            <StoreModal />
        </>
    )
}