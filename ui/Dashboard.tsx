import { Suspense } from "react";
import LineChartWrapper from "@/ui/LineChartWrapper";
import BarChartWrapper from "@/ui/BarChartWrapper";
import DataTableWrapper from "@/ui/DataTableWrapper";

export default async function Dashboard() {

  return (

    <>
      <div className="grid grid-cols-12 gap-4 justify-stretch">
        <div className="col-span-12 xl:col-span-4">
          {/* <Suspense fallback={<div>Loading...</div>}> */}
          <DataTableWrapper defaultDropdownValue="main_genre" />
          {/* </Suspense> */}
        </div>
        <div className="col-span-12 xl:col-span-8">
          {/* <Suspense fallback={<div>Loading...</div>}> */}
          <LineChartWrapper
            height={430}
            chartId="test"
            defaultDropdownValue="main_genre"
          />
          {/* </Suspense> */}
        </div>



        <div
          //  className="col-start-1 col-end-3"
          className="col-span-12 xl:col-span-5"
        >
          {/* <Suspense fallback={<div>Loading...</div>}> */}
          {/* <div className="flex flex-grow"> */}
          <BarChartWrapper

            chartId="test"
            defaultDropdownValue="song"
            classNames=""
          />
          {/* </div> */}
          {/* </Suspense> */}
        </div>

        <div
          //  className="container col-start-3 col-end-4"
          className="col-span-12 xl:col-span-7"
        >
          {/* <Suspense fallback={<div>Loading...</div>}> */}
          <LineChartWrapper

            chartId="test"
            defaultDropdownValue="artist"
          />
          {/* </Suspense> */}
        </div>
      </div>
    </>
  )
}