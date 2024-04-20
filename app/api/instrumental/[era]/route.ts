import { getInstrumentalData } from '@/lib/db/query-spotify-instrumental'
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

  const data = await getInstrumentalData(theme as Theme)

  return NextResponse.json(data)
}