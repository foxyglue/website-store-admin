'use client'

import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Store } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useStoreModal } from "@/hooks/use-store-modal";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown, PlusCircle, Store as StoreIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "./ui/command";

type PopOverTriggerProps = React.ComponentProps<typeof PopoverTrigger> //inherits all the props and behaviors of a PopoverTrigger component

interface StoreSwitcherProps extends PopOverTriggerProps {
    items: Store[] // data toko yang diambil dari database
}

const StoreSwitcher = ({
    className,
    items = []
}: StoreSwitcherProps) => {

    const storeModal = useStoreModal() // fungsi untuk membuka modal
    const params = useParams() // mengambil params dari url
    const router = useRouter() // fungsi untuk mengubah url

    const formattedItems = items.map((item) => ({
        label: item.name,
        value: item.id,
    }))

    const currentStore = formattedItems.find((item) => item.value === params.storeId) // mencari toko yang sesuai dengan id yang ada di url

    const [open, setOpen] = useState(false) // state untuk membuka dan menutup modal

    const onStoreSelect = (store: { label: string; value: string }) => {
        setOpen(false) // menutup modal
        router.push(`/${store.value}`) // mengubah url sesuai dengan id toko yang dipilih
    }

    return ( 
        //onopenchange adalah fungsi yang akan dipanggil ketika modal dibuka atau ditutup
        // popover adalah komponen yang akan menampilkan modal ketika diklik

        <Popover open={open} onOpenChange={setOpen}> 
            <PopoverTrigger asChild>
                <Button variant={"outline"} size={"sm"} role="combobox" aria-expanded={open} aria-label="Pilih Toko" 
                className={cn("w-[200px] justify-between", className)} onClick={() => setOpen(true)}> 
                    <StoreIcon className="mr-2 h-4 w-4" />
                    {currentStore?.label}
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 overflow-hidden">
                <Command>
                    <CommandList>
                        <CommandInput placeholder="Cari Toko..." />
                        <CommandEmpty>
                            Tidak ada toko yang ditemukan.
                        </CommandEmpty>
                        <CommandGroup heading="Toko">
                            {formattedItems.map((store) => (
                                    <CommandItem key={store.value} onSelect={() => onStoreSelect(store)} className="text-sm cursor-pointer">
                                        <StoreIcon className="mr-2 h-4 w-4"/>
                                        {store.label}
                                        <Check className={cn("ml-auto h-4 w-4", currentStore?.value === store.value ? "opacity-100" : "opacity-0")} />
                                    </CommandItem>
                                )
                            )}
                        </CommandGroup>
                    </CommandList>

                    {/* pemisah antara list toko dengan tombol untuk menambah toko baru */}
                    <CommandSeparator />

                    <CommandList>
                        <CommandGroup>
                            <CommandItem onSelect={() => {
                                storeModal.onOpen() // membuka modal untuk menambah toko baru; modal adalah komponen yang akan menampilkan form untuk menambah toko baru
                                setOpen(false)
                            }} 
                                className="text-sm cursor-pointer">
                                    <PlusCircle className="mr-2 h-5 w-5" />
                                    Buat Toko Baru
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>

                </Command>
            </PopoverContent>
        </Popover>
                // cn adalah fungsi untuk menggabungkan className dari luar dengan className dari dalam
     );
}
 
export default StoreSwitcher;