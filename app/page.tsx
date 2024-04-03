import { Suspense } from "react";

import { ThemeWrapper } from "@/components/theme-wrapper";
import { MenuBar } from "@/components/menu-bar";
import { getTopArtist, topAlbumQuery } from "@/lib/db/data";

import { CoreCardWrapper } from "@/components/graphics/CoreCards/animation-wrapper";
import CoreCards from "@/components/graphics/CoreCards/cards";


export default async function Page() {
  // const topArtist = await getTopArtist({ offset: 0, filter: { main_genre: 'rock'} });
  // const topAlbum = await topAlbumQuery({ offset: 0  })
  // console.log(topAlbum);
  return (
    <>
      <ThemeWrapper className="flex-1 flex">
        <div className="flex flex-col flex-1 p-4">
          <MenuBar />
          <Suspense fallback={<div></div>}>
            <CoreCardWrapper
              className={`flex-1 w-full grid grid-rows-4 
            grid-cols-1 lg:grid-cols-4 
            lg:grid-rows-1
            gap-4
            `}
            >
              <CoreCards />
            </CoreCardWrapper>
          </Suspense>
        </div>
      </ThemeWrapper>
    </>
  );
}
