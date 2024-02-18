"use client";
import React  from "react";

interface BaseChartProps {
    className?: string;
    children?: React.ReactNode;
  }

  const BaseChart = ({ className, children }: BaseChartProps) => {
    return (
        <div className={`bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default ${className}`}>
            {children}
        </div>
    );
};

export default BaseChart;