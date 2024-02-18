'use client';
import { ApexOptions } from "apexcharts";
import React, { useState } from "react";
import DropdownDefault from "../Dropdowns/DropdownDefault";
import dynamic from "next/dynamic";
import { GraphData, GraphSeries } from "@/app/lib/definitions";

const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

interface AreaGraphProps {
  data: GraphSeries;
  options: ApexOptions;
  height?: number;
}

const AreaGraph: React.FC<AreaGraphProps> = ({ data, options, height }) => {

  return (
    <ApexCharts
    options={options}
    series={data}
    type="area"
    height={height}
  />
  );
};

export default AreaGraph;
