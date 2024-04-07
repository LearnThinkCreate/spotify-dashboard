import * as React from "react";
import { EraFilter } from "@/components/era-filter";
import { ThemeWrapper } from "@/components/theme-wrapper";
import { BarGraph } from "@/components/graphics/bar-graph";
import { LineGraph } from "@/components/graphics/line-graph";

export default async function Page({}) {
  return (
    <>
      <div className="flex flex-col h-full overflow-auto">
        <div className="snap-y snap-mandatory overflow-scroll flex-1">
          <div className="snap-center h-full flex p-4">
            <BarGraph initialData={null} className="" />
          </div>
          <div className="snap-center h-full flex p-4">
            <LineGraph initialData={null} className="" />
          </div>
          <div className="snap-center h-full flex items-center justify-center bg-red-500">
            <p className="text-2xl text-white">Page 3</p>
          </div>
        </div>
      </div>
    </>
  );
}
