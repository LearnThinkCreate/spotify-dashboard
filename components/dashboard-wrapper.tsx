import * as React from "react";
import { FavoriteCard } from "@/components/card-favorite";
import { FavoriteGenre } from "@/components/card-favorite-genre";
import { BarGraph } from "@/components/graph-main-bar";
import { EraImage } from "@/components/media-era-image";
import { EnergyCard } from "@/components/graph-energy";
import { InstrumentalCard } from "@/components/card-instrumental";
import { getDefaultTheme } from "@/components/themes";
import { getDefaultBarGraphOption } from "@/components/graph-options";
import { getRapData } from "@/lib/db/query-spotify-rap";
import { getEnergyLevel } from "@/lib/db/query-spotify-energy";
import { getInstrumentalData } from "@/lib/db/query-spotify-instrumental";
import { getBarData } from "@/lib/db/query-bar-data";
import { getRandomImagePath } from "@/lib/query-era-image";
import { topCategory } from "@/lib/db/query-top-category";

export default async function Dashboard({}) {
   const defaultTheme = getDefaultTheme();
   const defaultBarGraphOption = getDefaultBarGraphOption();
   const rapData = getRapData(defaultTheme);
   const energyLevelData = getEnergyLevel(defaultTheme);
   const instrumentalData = getInstrumentalData(defaultTheme);
   const barData = getBarData({
      category: defaultBarGraphOption.value,
      currentTheme: defaultTheme,
   });
   const randomImagePathData = getRandomImagePath(defaultTheme);
   const topArtistData = topCategory({
      category: "artist",
      currentTheme: defaultTheme,
   });
   const topSongData = topCategory({
      category: "song",
      currentTheme: defaultTheme,
   });
   const topAlbumData = topCategory({
      category: "album",
      currentTheme: defaultTheme,
   });

   const [
      rap,
      energyLevel,
      instrumental,
      bar,
      randomImagePath,
      topArtist,
      topSong,
      topAlbum,
   ] = await Promise.all([
      rapData,
      energyLevelData,
      instrumentalData,
      barData,
      randomImagePathData,
      topArtistData,
      topSongData,
      topAlbumData,
   ]);

   return (
      <React.Suspense fallback={<div>Loading...</div>}>
         {/* <div className="flex-none block lg:flex-1 h-full  lg:flex lg:flex-col p-6 pb-2"> */}
         <div className="flex flex-col h-full p-2 overflow-scroll">
            <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-4">
               <EraImage randomImagePath={randomImagePath} />
               <FavoriteCard
                  className="h-72"
                  initialTopArtist={topArtist}
                  initialTopSong={topSong}
                  initialTopAlbum={topAlbum}
               />
               <FavoriteGenre
                  className="flex flex-col h-72"
                  initialData={rap}
               />
               <EnergyCard className="h-72" initialData={energyLevel} />
               <InstrumentalCard
                  className="flex flex-col h-72 lg:hidden lg:flex-none xl:flex xl:flex-col"
                  initialData={instrumental}
               />
            </div>
            <BarGraph className="flex flex-col h-auto min-h-full lg:min-h-0 lg:h-full" initialData={bar} />
         </div>
      </React.Suspense>
   );
}
