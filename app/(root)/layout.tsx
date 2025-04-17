import { auth } from "@clerk/nextjs/server";
import React from "react";
import { redirect } from "next/navigation";
import db from "@/lib/db";

export default async function SetupLayout({
    children,

}: {
    children: React.ReactNode;
}) {
    const { userId } = await auth()
    if (!userId) {
        redirect("/sign-in")
    }

    const store = await db.store.findFirst({
        where: {
            userId: userId,
        }
    })

    // jika ditemukan store
    if (store) {
        redirect(`/${store.id}`)
    }

    return (
        <>
        {children}
        </>
    )
}