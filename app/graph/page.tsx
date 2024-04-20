import * as React from "react";
import { LineGraph } from "@/components/graph-main-line";
import { PieGraph } from "@/components/graph-pie";
import { EnergyCard } from "@/components/graph-energy";

export default async function Page({}) {
  return (
    <>
      <div className="flex flex-col h-full">
        {/* <div className="snap-y snap-mandatory overflow-scroll flex-1">
          <div className="snap-center h-full flex p-4">
            <EnergyCard />
          </div>
          <div className="snap-center h-full flex p-4">
            <LineGraph className="grow flex flex-col" />
          </div>
          <div className="snap-center h-full flex p-4">
          <PieGraph className="grow flex flex-col" />
          </div>
        </div> */}
      </div>
    </>
  );
}
