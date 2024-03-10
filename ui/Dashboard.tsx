import { Suspense } from "react";
import PageFilters from "@/ui/PageFilters";
import BarChart from "@/components/Charts/BarChart";
import LineChart from "@/components/Charts/LineChart";
import ReusableDataTable from "@/components/Datatables/ReusableDataTable";
import AudioFeatureChart from "@/components/Charts/AudioFeatureChart";
import CardSection from "./CardSection";


export default async function Dashboard(
  searchParams: any
) {
  return (
    <div className="relative flex flex-col">
    <div className="sticky top-0 left-0 right-0 z-999 py-10 bg-boxdark-2 xl:hidden">
      <div className="rounded-lg mx-2 items-center">
        <PageFilters />
      </div>
    </div>

    <div className="grid grid-cols-12 gap-4 justify-stretch pt-4 xl:pt-0">
      <div className="hidden xl:col-span-2 xl:flex">
        <PageFilters />
      </div>
      <div className="col-span-12 xl:col-span-4 ">
        <Suspense fallback={<div>Loading...</div>}>
          <ReusableDataTable
            defaultDropdownValue="main_genre"
            classNames="h-full"
          />
        </Suspense>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
      <CardSection searchParams={searchParams['searchParams']}/>
      </Suspense>

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
  </div>
  );
}