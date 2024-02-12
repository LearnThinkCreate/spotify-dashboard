import { ApexOptions } from "apexcharts";
import React, { useState } from "react";
import DropdownDefault from "../Dropdowns/DropdownDefault";
import dynamic from "next/dynamic";
import { GraphData, GraphSeries } from "@/app/lib/definitions";

const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

interface LineGraphProps {
  data: GraphSeries;
  options: ApexOptions;
}

const LineGraph: React.FC<LineGraphProps> = ({ data, options }) => {

  return (


    <div id="chartSix" className="-ml-5">
      <ApexCharts
        options={options}
        series={data}
        type="line"
        height={200}
      />
    </div>
  );
};

export default LineGraph;
