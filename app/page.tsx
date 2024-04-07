import { Suspense } from "react";

import { CoreCardWrapper } from "@/components/card-core-animation";
import CoreCards from "@/components/card-core";


export default async function Page() {
  return (
    <div className="h-full p-4">
      <Suspense fallback={<div></div>}>
        <CoreCardWrapper
          className={`w-full grid grid-rows-4 
            grid-cols-1 lg:grid-cols-4 
            lg:grid-rows-1
            gap-4
          `}
        >
          <CoreCards />
        </CoreCardWrapper>
      </Suspense>
    </div>
  );
}
