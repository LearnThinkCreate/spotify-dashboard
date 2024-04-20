import Dashboard from "@/components/dashboard-wrapper";
import { preloadRapData } from "@/lib/db/query-spotify-rap";
import { preloadEnergyLevel } from "@/lib/db/query-spotify-energy";
import { preloadInstrumentalData } from "@/lib/db/query-spotify-instrumental";
import { preloadBarData } from "@/lib/db/query-bar-data";
import { getDefaultTheme } from '@/components/themes'
import { getDefaultBarGraphOption } from '@/components/graph-options'
import { preloadTopCategory } from "@/lib/db/query-top-category";
import { DEFAULT_REVALIDATE } from '@/lib/utils'

export default async function Page({  }) {
  const defaultTheme = getDefaultTheme();
  void preloadRapData(defaultTheme);
  void preloadEnergyLevel(defaultTheme);
  void preloadInstrumentalData(defaultTheme);
  void preloadBarData({
    category: getDefaultBarGraphOption().value,
    currentTheme: defaultTheme,
  })
  void preloadTopCategory( "artist", defaultTheme );
  void preloadTopCategory( "song", defaultTheme );
  void preloadTopCategory( "album", defaultTheme );

  return (
    <Dashboard />
  );
}

export const revalidate = DEFAULT_REVALIDATE;