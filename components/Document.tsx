"use client";
import { FormEvent, useEffect, useState, useTransition } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import Editor from "./Editor";
import useOwner from "@/lib/useOwner";
import DeleteDocument from "./DeleteDocument";
import InviteUser from "./InviteUser";
import ManageUsers from "./ManageUsers";
import Avatars from "./Avatars";

function Document({id}: { id: string }) {
    const[data,loading,error] = useDocumentData(doc(db, "documents", id));
    const[input,setInput] = useState ("");
    const[isUpdating, startTransition] = useTransition();
    const isOwner = useOwner();
  

    useEffect(() => {
        if (data) {
            setInput(data.title);
        }

    },[data])


    const updateTitle = (e: FormEvent ) => {
        e.preventDefault();

        if ( input.trim()){
            startTransition(async () =>{
                await updateDoc (doc(db, "documents", id),{
                    title: input,
                });
            })
        }
    }

    return(
        <div className="flex-1 h-full bg-white p-5">
    
            <div className = "flex max-w-6xl mx-auto justify-between pb-5">
                <form  className ="flex  flex-1 space-x-2" onSubmit={updateTitle}>
                    {/* update title.. */}
                    <Input className="bg-white text-black text-2xl font-bold p-4 rounded-md shadow" value={input} onChange = {(e)=> setInput(e.target.value)} />

                    <Button className="px-6 py-3 bg-black text-white rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-300 ease-in-out" disabled= {isUpdating} type="submit">
                        {isUpdating ? "Updating..." : "Update"}
                    </Button>

                    {/* IF */}
                    {isOwner && (
                        <>
                            {/* InviteUser */}
                            <InviteUser/>
                            <DeleteDocument/>
                        </>
                    )}
                    {/* isOwner && InviteUser, DeleteDocument */}
                </form>
            </div>

            <div className="flex max-w-6xl mx-auto justify-between items-center mb-5">
                {/* {ManageUsers} */}
                <ManageUsers/>
                {/* Avatars */}
                <Avatars />
            </div>

            <hr className="pb-10"/>

            {/* collaborative Editor */}
            <Editor />
        </div>
    );
}

export default Document;