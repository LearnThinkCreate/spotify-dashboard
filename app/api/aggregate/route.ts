import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) 
{   
    console.log("GET request received");
    const queryString = new URL(request.url).searchParams.get('query');
    const prismaParams = JSON.parse(queryString) as Prisma.spotify_data_overviewGroupByArgs;
    const data = await (prisma.spotify_data_overview.groupBy as any)(prismaParams);
    return new Response(JSON.stringify(data), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}