import { prismaGenreOptions } from '@/lib/db/query-genre-options'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const genreQuery = searchParams.get('query') as string

    const data = await prismaGenreOptions(genreQuery)

    return NextResponse.json(data)
  }