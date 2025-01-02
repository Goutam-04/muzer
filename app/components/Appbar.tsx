'use client'
import { signIn, signOut, useSession } from "next-auth/react"

const Appbar = () => {

    const session=useSession();

    return (
        <>
            <div className="flex justify-center">
                <div>muzi</div>
                <div>
                    {session.data?.user&&<button onClick={() => signIn()} >Sign In</button>}
                    {!session.data?.user&&<button onClick={() => signOut()} >Log Out</button>}
                    
                </div>
            </div>
        </>
    )
}

export default Appbar