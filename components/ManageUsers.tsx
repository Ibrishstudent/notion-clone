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
import { FormEvent, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { deletedDocument, inviteUserToDocument, removeUserFromDocument } from "@/actions/actions";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { useUser } from "@clerk/nextjs";
import useOwner from "@/lib/useOwner";
import { useRoom } from "@liveblocks/react/suspense";
import { db } from "@/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { collectionGroup, query, where } from "firebase/firestore";
  
function ManageUsers() {
    const { user } = useUser();
    const room = useRoom();
    const isOwner = useOwner();
    const [ isOpen, setIsOpen] =useState(false);
    const [isPending, startTransition] = useTransition();
  

    const [usersInRoom] = useCollection(
        user && query(collectionGroup(db,"rooms"), where("roomId", "==",room.id))
    );
    const handleDelete = async (userId : string) => {
        startTransition( async () => {
            if (!user) return;

            const { success } = await removeUserFromDocument(room.id,userId);

            if (success){
                toast.success("User removed from room successfully!");
            }else{
                toast.error("Failed to remove user from room!");
            }
        })
    };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
    <DialogTrigger asChild >
        <Button className="bg-slate-50 text-black hover:bg-slate-300">Users ({usersInRoom?.docs.length})</Button>
  </DialogTrigger>
    {/* <Button  className="bg-red-600 text-white hover:bg-red-700">
        <DialogTrigger>Delete</DialogTrigger>
    </Button> */}
        <DialogContent className="bg-white z-50 text-black rounded-lg shadow-xl">
            <DialogHeader  className="text-center">
                <DialogTitle>Users with Access</DialogTitle>
                <DialogDescription>
                    Below is a list of users who have access to this document.
                </DialogDescription>
            </DialogHeader>

            <hr className="my-2" />

            <div className="flex flex-col space-y-2">
                {usersInRoom?.docs.map((doc) => (
                    <div key = {doc.data().userId}
                        className = "flex items-center justify-between"
                    >
                        <p className="font-light">
                        {doc.data().userId === user?.emailAddresses[0].toString()
                            ? `You (${doc.data().userId})`
                            : doc.data().userId}
                        </p>    
                            <div className="flex items-center gap-2">
                                <Button > {doc.data().role}</Button>

                                {isOwner &&
                                    doc.data().userId !== user?.emailAddresses[0].toString() && (
                                        <Button
                                            className="bg-red-700 z-50 text-white rounded-lg shadow-xl"
                                            onClick={() => handleDelete(doc.data().userId)}
                                            disabled={isPending}
                                            size="sm"
                                        >
                                            {isPending ? "Removing..." : "x"}
                                        </Button>
                                    )}
                            </div>

                    </div>
                ))}
            </div>
        </DialogContent>
    </Dialog>
  );
}

export default ManageUsers;