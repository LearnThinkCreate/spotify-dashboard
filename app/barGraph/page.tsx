import * as React from "react";
import { EraFilter } from "@/components/era-filter";
import { ThemeWrapper } from "@/components/theme-wrapper";
import prisma from "@/lib/db/prisma";
import { BarGraph } from "@/components/graphics/bar-graph";

export default async function Page({}) {
  return (
    <>
        <div className="flex flex-col flex-1 p-4">
          <EraFilter />
          <ThemeWrapper className="flex flex-1">
            <BarGraph  />
          </ThemeWrapper>
        </div>
    </>
  );
}