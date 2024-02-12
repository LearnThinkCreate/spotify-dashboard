import { ApexOptions } from "apexcharts";
import React, { useState } from "react";
import DropdownDefault from "../Dropdowns/DropdownDefault";
import dynamic from "next/dynamic";
import { GraphData, GraphSeries } from "@/app/lib/definitions";

const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

interface AreaGraphProps {
  data: GraphSeries;
  options: ApexOptions;
}

const AreaGraph: React.FC<AreaGraphProps> = ({ data, options }) => {

  return (
    <div className="-ml-5">
      <ApexCharts
        options={options}
        series={data}
        type="area"
        height={200}
      />
    </div>
  );
};

export default AreaGraph;
