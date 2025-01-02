import { primaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod"
import YouTube from "youtube-sr";

const YT_REGEX= /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/

const CreateStreamSchema = z.object({
    creatorId: z.string(),
    url: z.string() // do if separate sporify and yhoutube name and separeate api

})


export async function POST(req:NextRequest){
    try{
        const data = CreateStreamSchema.parse(await req.json());
        const isYt = data.url.match(YT_REGEX)

        if(!isYt){
            return NextResponse.json({
                messege:"wrong url format"
            },{status:411})
        }

        const extractedId = data.url.split("?v")[1];

        const res = await YouTube.getVideo(data.url)
        console.log(res.title);
        console.log(res.thumbnail?.url)

     const stream = await primaClient.stream.create({
            data:{
                userId :data.creatorId,
                url: data.url,
                extractedId,
                type: "Youtube",
                title: res.title ?? "can't find a title",
                image: res.thumbnail?.url ?? "can't fecth the thumbnail"
                
            }
        })

        return NextResponse.json({
            message:"added stream",
            id: stream.id
        })
    }catch(err){
        console.log(err)
        return NextResponse.json({
            
            message:"error while adding a stream"
        },{status:411})
    }

}


export async function GET(req:NextRequest){
    const creatorId = req.nextUrl.searchParams.get("creatorId");
    const streams = await primaClient.stream.findMany({
        where:{
            userId:creatorId ?? ""
        }
    })

    return NextResponse.json({
        streams
    })
}

