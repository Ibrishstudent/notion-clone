import { auth } from "@clerk/nextjs/server";
import RoomProvider  from "@/components/RoomProvider";


async function DocLayout(
    props:{ 
        children:React.ReactNode;
        params: Promise<{ id: string }>;
        
    }
) {
    const params = await props.params;

    const {
        id
    } = params;

    const {
        children
    } = props;

    auth.protect();

    return <RoomProvider roomId={id}> {children} </RoomProvider>;
}

export default DocLayout;