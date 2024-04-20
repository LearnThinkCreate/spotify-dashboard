import { topCategory } from '@/lib/db/query-top-category'
import { Theme, themes } from '@/components/themes'
import { NextResponse } from 'next/server'
import { DEFAULT_REVALIDATE } from '@/lib/utils'

export async function generateStaticParams() {
    return themes.map((theme) => ({
        era: theme.era,
    }))
}

export async function GET(
    request: Request,
    { params }: { params: { era: string } }
  ) {
    const era = params.era

    const theme = themes.find((theme) => theme.era === era)
    const categories = ["artist", "song", "album"]
    const data = await Promise.all(
        categories.map((category) => topCategory({
            category,
            currentTheme: theme as Theme
        }))
    )

    return NextResponse.json(data)
  }

  export const revalidate = DEFAULT_REVALIDATE;