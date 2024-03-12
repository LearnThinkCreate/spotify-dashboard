import { NextRequest, NextResponse } from 'next/server';
import query from '@/lib/db/index';

export async function GET(request: NextRequest) {
    const queryString = new URL(request.url).searchParams.get('query');
    try {
        const result = await query(queryString);
        return new NextResponse(JSON.stringify(result), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: 'Failed to query Spotify data' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}

