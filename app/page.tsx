import * as React from "react";
import { FavoriteCard } from "@/components/card-favorite";
import { FavoriteGenre } from "@/components/card-favorite-genre";
import { BarGraph } from "@/components/graph-main-bar";
import { EraImage } from "@/components/media-era-image";
import { EnergyCard } from "@/components/graph-energy";
import { InstrumentalCard } from "@/components/card-instrumental";

export default async function Page({  }) {
  return (
    <div className="flex-none block lg:flex-1 h-full  lg:flex lg:flex-col p-6 pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-4">
          <EraImage />
          <FavoriteCard className="h-72" />
          <FavoriteGenre className="flex flex-col h-72"/>
          <EnergyCard className="h-72"/>
          {/* <InstrumentalCard className="flex flex-col lg:hidden lg:flex-none xl:flex xl:flex-col min-h-72"/> */}
          <InstrumentalCard className="flex flex-col h-72 lg:hidden lg:flex-none xl:flex xl:flex-col"/>
        </div>
        <BarGraph className="flex flex-col h-full mb-2" />
    </div>
  );
}
