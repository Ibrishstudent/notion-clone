import { adminDb } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    auth.protect();

    const { sessionClaims } = await auth();
    const { room } = await req.json();
    console.log("🔐 Authenticated as:", sessionClaims?.email);
    console.log("📄 Requesting access to room:", room);

    if (!sessionClaims?.email || !sessionClaims?.fullName || !sessionClaims?.image) {
        return NextResponse.json({ message: "Unauthorized - missing session details" }, { status: 401 });
      }
      
      const session = liveblocks.prepareSession(sessionClaims.email, {
        userInfo:{
          name: sessionClaims.fullName,
          email: sessionClaims.email,
          avatar: sessionClaims.image,
        },
      });

    const usersInRoom = await adminDb
    .collectionGroup("rooms")
    .where("userId", "==" , sessionClaims?.email)
    .get();

    console.log("📁 Rooms found for user:", usersInRoom.docs.map(doc => doc.id));

    const userInRoom = usersInRoom.docs.find((doc) =>{
        const docData = doc.data();
        console.log("🧾 Checking doc data:", doc.id, docData);
        return docData.roomId === room;
    });

    if (userInRoom?.exists){
        console.log("✅ User is in room. Granting access.");
        session.allow(room,session.FULL_ACCESS);
        const { body, status } = await session.authorize();
        console.log("you are authorised");
        
        return new Response(body, { status });
    } else{
        console.warn("❌ User is NOT in the room. Access denied.");
        return NextResponse.json (
            { message: "you are not in this room"},
            { status: 403 }
        );
    }
}