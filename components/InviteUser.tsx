"use client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { FormEvent, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { inviteUserToDocument } from "@/actions/actions";
import { toast } from "sonner";
import { Input } from "./ui/input";
  
function InviteUser() {
    const [ isOpen, setIsOpen] =useState(false);
    const [email,setEmail] = useState("");
    const [isPending, startTransition] = useTransition();
    const pathname = usePathname();


    const handleInvite = async (e:FormEvent) => {
        e.preventDefault();

        const roomId = pathname.split("/").pop();
        if (!roomId) return;

        startTransition(async () => {
            const { success } = await inviteUserToDocument(roomId,email);

            if(success){
                setIsOpen(false);
                setEmail("");
                toast.success("User Added to Room Successfully!");
            }else{
                toast.error("Failed to add user to room!");
            }
        });
    };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
    <DialogTrigger asChild >
        <Button className="bg-slate-50 text-black hover:bg-slate-300">Invite</Button>
  </DialogTrigger>
    {/* <Button  className="bg-red-600 text-white hover:bg-red-700">
        <DialogTrigger>Delete</DialogTrigger>
    </Button> */}
        <DialogContent className="bg-white z-50 text-black rounded-lg shadow-xl">
            <DialogHeader  className="text-center">
                <DialogTitle>Invite User to collaborate!</DialogTitle>
                <DialogDescription>
                    Enter the user’s email to invite them to this document.
                </DialogDescription>
            </DialogHeader>


            <form className = "flex gap-2" onSubmit = {handleInvite}>
                <Input
                type = "email"
                placeholder="Email"
                className = "w-full"
                value = {email}
                onChange = {(e)=> setEmail(e.target.value)}
                />
                <Button className="bg-black z-50 text-white rounded-lg shadow-xl" type="submit" disabled={!email || isPending}>
                    {isPending ? "Inviting..." : "Invite"}
                </Button>
            </form>
        </DialogContent>
    </Dialog>
  );
}

export default InviteUser;