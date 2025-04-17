'use client'

import { useEffect, useState } from "react"
import { Button } from "./button"
import { ImagePlus, Trash } from "lucide-react"
import Image from "next/image"
import { CldUploadWidget } from "next-cloudinary"

interface ImageUploadProps {
    disabled?: boolean
    onChange: (value: string) => void
    onRemove: (value: string) => void
    value: string[]
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    disabled,
    onChange,
    onRemove,
    value = [],
}) => {
    const [isMounted, setIsMounted] = useState(false) 
    //untuk mengecek apakah komponen sudah dimounting atau belum (mounting adalah proses ketika komponen ditambahkan ke dalam DOM)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onUpload = (result: any) => {
        onChange(result.info.secure_url)
        // mengubah value dari input menjadi url gambar yang diupload
    }

    // jika komponen belum dimounting, maka tidak akan merender apapun (null)
    if (!isMounted) {
        return null
    }


    return (
        <div>
            <div className="mb-4 flex items-center gap-4">
                {value.map((url) => (
                    <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
                        <div className="z-10 absolute top-2 right-2">
                            <Button type="button" onClick={() => onRemove(url)} variant="destructive" size="icon">
                                <Trash className="h-4 w-4"/>
                            </Button>
                        </div>
                        <Image 
                        fill
                        className="object-cover"
                        alt="Image"
                        src={url}
                        />
                    </div>
                ))}
            </div>
            <CldUploadWidget onUpload={onUpload} uploadPreset="amkikus3" >
                {({open}) => {
                    const onClick = () => {
                        open()
                    }
                    return (
                        <Button type="button" disabled={disabled} variant="secondary" onClick={onClick}>
                            <ImagePlus className="h-4 w-4 mr-2"/>
                            Upload Image
                        </Button>
                    )
                }}
            </CldUploadWidget>
        </div>
    )
}

export default ImageUpload