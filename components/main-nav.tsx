'use client'

import { cn } from "@/lib/utils"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"

export function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {

    const pathname = usePathname()
    const params = useParams()

    const routes = [
        {
            href: `/${params.storeId}`, // storeId dari params yg diambil dari url; di nextjs [] adalah params, sesuai dgn folder [storeId]
            label: "Dashboard",
            active: pathname === `/${params.storeId}`,
        },
        {
            href: `/${params.storeId}/banners`, 
            label: "Banners",
            active: pathname === `/${params.storeId}/banners`,
        },
        {
            href: `/${params.storeId}/categories`, 
            label: "Categories",
            active: pathname === `/${params.storeId}/categories`,
        },
        {
            href: `/${params.storeId}/products`, 
            label: "Products",
            active: pathname === `/${params.storeId}/products`,
        },
        {
            href: `/${params.storeId}/settings`, // storeId dari params yg diambil dari url; di nextjs [] adalah params, sesuai dgn folder [storeId]
            label: "Settings",
            active: pathname === `/${params.storeId}/settings`,
        }
    ]

    return (
        // bisa menerima className dari luar
        <nav {...props} className={cn("flex items-center space-x-4 lg:space-x-6", className)}> 
            {routes.map((route) => (
                <Link key={route.href} href={route.href} className={cn("text-sm font-medium transition-colors hover:text-primary", route.active ? "text-black dark:text-white" : "text-muted-foreground")}>
                    {route.label}
                </Link>
            ))}
        </nav>
    )
}