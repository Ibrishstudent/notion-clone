"use client";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { useState, useTransition } from "react";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { deletedDocument } from "@/actions/actions";
import { toast } from "sonner";
  
function DeleteDocument() {
    const [ isOpen, setIsOpen] =useState(false);
    const [isPending, startTransition] = useTransition();
    const pathname = usePathname();
    const router = useRouter();


    const handleDelete = async () => {
        const roomId = pathname.split("/").pop();
        if (!roomId) return;

        startTransition(async () => {
            const { success } = await deletedDocument(roomId);

            if(success){
                setIsOpen(false);
                router.replace("/");
                toast.success("Room Deleted sucessfully!");
            }else{
                toast.error("Failed to delete room!");
            }
        });
    };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
    <DialogTrigger asChild>
        <Button className="bg-red-600 text-white hover:bg-red-700">Delete</Button>
  </DialogTrigger>
    {/* <Button  className="bg-red-600 text-white hover:bg-red-700">
        <DialogTrigger>Delete</DialogTrigger>
    </Button> */}
        <DialogContent className="bg-white z-50 text-black rounded-lg shadow-xl">
            <DialogHeader  className="text-center">
                <DialogTitle className="text-2xl text-center">
                    Are you absolutely sure?</DialogTitle>
                <DialogDescription className="text-center text-gray-600">
                    This will delete the document and all its contents, removing all 
                    users from the document.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-end gap-2">
                <Button
                    type="button"
                    className="bg-red-600 text-white hover:bg-red-700"
                    onClick={handleDelete}
                    disabled={isPending}
                >
                    {isPending ? "Deleting..": "Delete"}
                </Button>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        Close
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  );
}

export default DeleteDocument;