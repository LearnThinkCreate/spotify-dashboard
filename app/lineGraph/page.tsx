import * as React from "react";
import { EraFilter } from "@/components/era-filter";
import { ThemeWrapper } from "@/components/theme-wrapper";
import { LineGraph } from "@/components/graphics/line-graph";

export default async function Page() {
  return (
    <>
        <div className="flex flex-col flex-1 p-4">
          <EraFilter />
          <ThemeWrapper className="flex flex-1" >
            <LineGraph initialData={null} />
          </ThemeWrapper>
        </div>
    </>
  );
}

