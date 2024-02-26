import { Suspense } from "react";
import PageFilters from "@/ui/PageFilters";
import BarChart from "@/components/Charts/BarChart";
import LineChart from "@/components/Charts/LineChart";
import ReusableDataTable from "@/components/Datatables/ReusableDataTable";
import AudioFeatureChart from "@/components/Charts/AudioFeatureChart";


export default async function Dashboard(
) {
  return (
    <>
      <div className="grid grid-cols-12 gap-4 justify-stretch">
        <div className="col-span-2 flex">
          <PageFilters />
        </div>
        <div className="col-span-10 xl:col-span-4 ">
          <Suspense fallback={<div>Loading...</div>}>
          <ReusableDataTable defaultDropdownValue="main_genre" classNames="h-full" />
          </Suspense>
        </div>
        <div className="col-span-12 xl:col-span-6">
          <Suspense fallback={<div>Loading...</div>}>
          <BarChart
            chartId="test"
            defaultDropdownValue="song"
            height={350}
          />
          </Suspense>
        </div>

        <div className="col-span-12 xl:col-span-4">
          <Suspense fallback={<div>Loading...</div>}>
          <BarChart
            chartId="test"
            defaultDropdownValue="artist"
            height={250}
          />
          </Suspense>
        </div>


        <div
          //  className="col-start-1 col-end-3"
          className="col-span-12 xl:col-span-4"
        >
          <Suspense fallback={<div>Loading...</div>}>
          <LineChart
            chartId="test"
            defaultDropdownValue="genre_category"
            height={250}
          />
          </Suspense>
        </div>

        <div
          //  className="container col-start-3 col-end-4"
          className="col-span-12 xl:col-span-4"
        >
          <Suspense fallback={<div>Loading...</div>}>
          <AudioFeatureChart
            type="area"
            chartId="test"
            height={250}
            className="h-full flex flex-col"
          />
          </Suspense>
        </div>



      </div>
    </>
  )
}