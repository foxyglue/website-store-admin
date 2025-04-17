import { useEffect, useState } from "react"

export const useOrigin = () => {
    const [mounted, setMounted] = useState(false)
    const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : ""
    // jika window tidak ada, maka akan mengembalikan string kosong; window.location.origin adalah url dari website yang sedang dibuka
    // jika window ada, maka akan mengembalikan url dari website yang sedang dibuka

    // ini digunakan untuk mengecek apakah component sudah di mount atau belum; 
    // mount adalah proses ketika component sudah ditampilkan di browser
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return ""
    }

    return origin
    // jika mounted true, maka akan mengembalikan origin
}