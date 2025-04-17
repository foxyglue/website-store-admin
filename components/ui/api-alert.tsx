'use client'

import { Copy, Server } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "./alert"
import { Badge, BadgeProps } from "./badge"
import { Button } from "./button"
import toast from "react-hot-toast"

interface ApiAlertProps {
    title: string
    description: string
    variant: "public" | "admin"
}

// textMap adalah object yang berisi text yang akan ditampilkan pada badge sesuai dengan variant yang dipilih
const textMap: Record<ApiAlertProps["variant"], string> = {
    public: "Public",
    admin: "Admin",
}

// BadgeProps["variant"] adalah type dari variant yang ada pada badge; 
// variantMap adalah object yang berisi variant yang akan ditampilkan pada badge sesuai dengan variant yang dipilih
const variantMap: Record<ApiAlertProps["variant"], BadgeProps["variant"]> = {
    public: "secondary",
    admin: "destructive",
}

export const ApiAlert: React.FC<ApiAlertProps> = ({
    title,
    description,
    variant = "public"

}) => {

    const onCopy = () => {
        navigator.clipboard.writeText(description) // untuk menyalin text ke clipboard
        toast.success("API Route berhasil disalin") 
    }

    return (
        <Alert>
            <Server className="h-4 w-4"/>
            <AlertTitle>
                {title}
                <Badge variant={variantMap[variant]}>
                    {textMap[variant]}
                </Badge>
            </AlertTitle>
            <AlertDescription className="flex items-center justify-between space-x-2">
                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm text-muted-foreground">
                    {description}
                </code>
                <Button variant={"outline"} size={"sm"} onClick={onCopy}>
                    <Copy className="h-4 w-4"/>
                </Button>
            </AlertDescription>
        </Alert>
    )
}