import { getBarData } from '@/lib/db/query-bar-data'
import { Theme } from '@/components/themes'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') as string
    const currentTheme = JSON.parse(searchParams.get('currentTheme') as string) as Theme
    const mainGenre = JSON.parse(searchParams.get('mainGenre') as string) as string[] || undefined
    const secondaryGenre = JSON.parse(searchParams.get('secondaryGenre') as string) as string[] || undefined

    const data = await getBarData({
        category,
        currentTheme,
        mainGenre,
        secondaryGenre,
    })
    return NextResponse.json(data)
  }