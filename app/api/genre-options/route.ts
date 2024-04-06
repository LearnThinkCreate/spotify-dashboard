import { NextRequest, NextResponse } from 'next/server';
import { prismaGenreOptions } from "@/lib/navigation-utils";

export async function GET(request: NextRequest) 
{
    const queryString = new URL(request.url).searchParams.get('query');
    console.log('queryString:', queryString);
    const genreOptions = await prismaGenreOptions(queryString);
    return new Response(JSON.stringify(genreOptions), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}