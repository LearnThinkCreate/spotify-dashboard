import { Suspense } from "react";
import LineChartWrapper from "@/ui/LineChartWrapper";
import BarChartWrapper from "@/ui/BarChartWrapper";
import DataTableWrapper from "@/ui/DataTableWrapper";

export default async function Dashboard() {

  return (

    <>
      <div className="grid grid-cols-3 gap-4">
        <div className="">
          <Suspense fallback={<div>Loading...</div>}>
            <DataTableWrapper defaultDropdownValue="main_genre" />
          </Suspense>
        </div>
        <div className="col-span-2 ...">
          <Suspense fallback={<div>Loading...</div>}>
            <LineChartWrapper
              height={430}
              chartId="test"
              defaultDropdownValue="main_genre"
            />
          </Suspense>
        </div>
        <div >
          <Suspense fallback={<div>Loading...</div>}>
            <BarChartWrapper
              height={450}
              chartId="test"
              defaultDropdownValue="artist"
            />
          </Suspense>
        </div>
        <div className="col-span-2 ...">
          <Suspense fallback={<div>Loading...</div>}>
            <LineChartWrapper
              height={450}
              chartId="test"
              defaultDropdownValue="artist"
            />
          </Suspense>
        </div>
      </div>
    </>
  )
}