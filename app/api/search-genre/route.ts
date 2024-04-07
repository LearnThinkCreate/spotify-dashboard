import { NextRequest, NextResponse } from 'next/server';
import { prismaGenreOptions } from "@/lib/db/query-utils";

export async function GET(request: NextRequest) 
{
    const queryString = new URL(request.url).searchParams.get('query');
    const genreOptions = await prismaGenreOptions(queryString);
    return new Response(JSON.stringify(genreOptions), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}