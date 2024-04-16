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
    {/* // <div className="flex-none lg:flex lg:flex-col lg:flex-1  h-full p-6 pb-0"> */}
    {/* // <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5  gap-4 mb-4"> */}
        <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-4">
          <EraImage />
          <FavoriteCard className="min-h-72" />
          <FavoriteGenre className="flex flex-col min-h-72"/>
          <EnergyCard className="min-h-72"/>
          <InstrumentalCard className="flex lg:hidden lg:flex-none xl:flex flex-col min-h-72"/>
        </div>
        <BarGraph className="flex flex-col h-full lmb-2" />
    </div>
  );
}
