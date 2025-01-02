import { primaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod"

const UpvoteSchema = z.object({
    streamId:z.string(),
})


export async function POST(req:NextRequest) {
    const session =await getServerSession();
    //TODO: Replace this email with id everywhere
    if(!session?.user?.email){
        return NextResponse.json({
            messege:"unauthenticated"
        },{status:403})
    }

    const user = await primaClient.user.findFirst({
        where: {
            email: session?.user?.email ?? "",
        },
    });

    if (!user) {
        return NextResponse.json({
            message: "user not found"
        }, { status: 404 });
    }

    
    try {
        const data = UpvoteSchema.parse(await req.json);
        await primaClient.upvotes.delete({
            where: {
                userId_streamId:{
                    userId: user.id,
                    streamId: data.streamId,
                }
            },
        });
    } catch (error) {
        return NextResponse.json({
            messege: "error while upvoting"
        })
    }


    const data = UpvoteSchema.parse(await req.json());
    
}