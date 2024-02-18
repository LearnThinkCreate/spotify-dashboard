"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

// Dynamic import for ApexCharts with SSR disabled
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

export type GraphData = {
  x: number | string;
  y: number | string;
};

export type GraphSeries = {
  name: string;
  data: GraphData[];
}[];

interface ChartProps {
  className?: string;
  series: GraphSeries;
  type: 'line' | 'bar' | 'area'; // Expand as needed
  title?: string;
  subtitle?: string;
  height?: number;
  baseOptions?: ApexOptions;
  additionalOptions?: ApexOptions;
}


const ChartComponent: React.FC<ChartProps> = ({
    className = '',
    series,
    type,
    title,
    subtitle,
    height,
    baseOptions = {},
    additionalOptions = {},
  }) => {
    // Default base options for ApexCharts
    const defaultBaseOptions: ApexOptions = {
      chart: {
        toolbar: {
          show: false,
        },
        animations: {
          enabled: true,
        },
      },
      stroke: {
        curve: 'smooth',
      },
      // Default options can be expanded based on requirements
    };
  
    // Merge base options with additional options
    const options: ApexOptions = {
      ...defaultBaseOptions,
      ...baseOptions,
      ...additionalOptions,
      chart: {
        ...defaultBaseOptions.chart,
        ...baseOptions.chart,
        ...additionalOptions.chart,
        type, // Ensure the chart type is driven by props
        height,
      },
    };

    console.log(series[0])
  
    return (
      <div className={`bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default ${className}`}>
        {title && <div className="flex items-start justify-center"><h2 className="text-xl font-bold">{title}</h2></div>}
        {subtitle && <p className="text-sm">{subtitle}</p>}
        <div>
          <ApexCharts options={options} series={series} type={type} height={height} />
        </div>
      </div>
    );
  };
  
  export default ChartComponent;
  