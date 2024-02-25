import React from "react";
import { Suspense } from "react";
import BarChart from "@/components/Charts/BarChart";
import LineChart from "@/components/Charts/LineChart";
import ReusableDataTable from "@/components/Datatables/ReusableDataTable";

const Dashboard: React.FC = () => {

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
      
      <ReusableDataTable
        data={[]}
        columns={[]}
        defaultPageSize={5}
        classNames="col-span-12 xl:col-span-5"
      />

      <LineChart
          className="col-span-12 xl:col-span-7"
          height={450}
          chartId="test1"
          defaultDropdownValue="song"
        />


      <BarChart
        className="col-span-12 xl:col-span-7"
        height={300}
        chartId="test"
      />


      <LineChart
        className="col-span-12 xl:col-span-5"
        height={300}
        chartId="test"
      />
    </div>
  )
}

export default Dashboard;