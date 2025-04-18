"use client";

import { handleClientScriptLoad } from "next/script";
import { Button } from "./ui/button";
import { startTransition, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CreateNewDocument } from "@/actions/actions";

function NewDocumentButton() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleCreateNewDocument = () =>{
        startTransition(async ()=> {
            const {docId} = await CreateNewDocument();
            router.push(`/doc/${docId}`)
        });
    };

  return <Button onClick={handleCreateNewDocument} className="px-6 py-3 bg-black text-white rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-300 ease-in-out" disabled= {isPending}>
            { isPending ? "Creating.." : "New Document"}
        </Button>;
}

export default NewDocumentButton;