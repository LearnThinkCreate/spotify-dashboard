import { getEnergyLevel } from '@/lib/db/query-spotify-energy'
import { Theme, themes } from '@/components/themes'
import { NextResponse } from 'next/server'

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

    const data = await getEnergyLevel(theme as Theme)

    return NextResponse.json(data)
  }