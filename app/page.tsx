import { Suspense } from "react";

import { ThemeWrapper } from "@/components/theme-wrapper";

import { CoreCardWrapper } from "@/components/graphics/card-animation-wrapper";
import CoreCards from "@/components/graphics/cards";


export default async function Page({ searchParams }) {
  return (
    <>
      <ThemeWrapper className="flex-1 flex">
        <div className="flex flex-col flex-1 p-4">
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
