import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import {
    basicLineQuery,
    instrumentalQuery,
    hoursListenedQuery,
} from "@/lib/db/data-main-line";

export async function GET(request: NextRequest) {
    const category = new URL(request.url).searchParams.get('category');

    if (!category) {
        return new Response('Category not found', {
            status: 400,
        });
    }

    const era = new URL(request.url).searchParams.get('era');
    const eraObj = era ? JSON.parse(era) : null;
    let query;
    switch (category) {
        case 'instrumental':
            query = instrumentalQuery({ era: eraObj });
            break;
        case 'hours_played':
            query = hoursListenedQuery({ era: eraObj });
            break;
        default:
            query = basicLineQuery({ category, era: eraObj });
    }
    const data = await prisma.$queryRawUnsafe(query);
    return new Response(JSON.stringify(data), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
    
