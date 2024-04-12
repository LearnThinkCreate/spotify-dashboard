import * as React from "react";
import { BarGraph } from "@/components/graph-main-bar";
import { LineGraph } from "@/components/graph-main-line";

export default async function Page({}) {
  return (
    <>
      <div className="flex flex-col h-full">
        <div className="snap-y snap-mandatory overflow-scroll flex-1">
          <div className="snap-center h-full flex p-4">
            <BarGraph className="grow flex flex-col" />
          </div>
          <div className="snap-center h-full flex p-4">
            <LineGraph className="grow flex flex-col" />
          </div>
          <div className="snap-center h-full flex items-center justify-center bg-red-500">
            <p className="text-2xl text-white">Page 3</p>
          </div>
        </div>
      </div>
    </>
  );
}
