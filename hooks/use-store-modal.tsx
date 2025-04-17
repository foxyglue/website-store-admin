import {create} from "zustand";

interface useStoreModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const useStoreModal = create<useStoreModalStore>((set) => ({ 
    //untuk membuat store modal (modal sebagai schema yang digunakan untuk menyimpan data)
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false}),
}));