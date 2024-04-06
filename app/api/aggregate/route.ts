import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/db/prisma";

export async function GET(request: NextRequest) 
{
    const queryString = new URL(request.url).searchParams.get('query');
    const data = await prisma.spotify_data_overview.groupBy(JSON.parse(queryString));
    return new Response(JSON.stringify(data), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}