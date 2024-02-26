"use client";
import { ApexOptions } from 'apexcharts';


export type GraphData = {
  x: number | string;
  y: number | string;
};

export type GraphSeries = {
  name: string;
  data: GraphData[];
}[];

export interface BaseChartProps {
  className?: string;
  series?: GraphSeries | any;
  type?: 'line' | 'bar' | 'area'; // Expand as needed
  title?: string;
  height?: number;
  baseOptions?: ApexOptions;
  additionalOptions?: ApexOptions;
  initialYaxisTitle?: string;
  chartId?: string;
  dropdownOptions?: Array<{ value: string; label: string }>;
  onDropdownChange?: (value: string) => void;
  defaultDropdownValue?: string;
}