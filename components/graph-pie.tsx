"use client";
import * as React from "react";
import { useThemeState } from "@/hooks/theme-state";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

export const PieGraph = ({
    data,
    className,
    dataKey,
    nameKey,
}: {
    data?: any;
    className?: string;
    dataKey?: string;
    nameKey?: string;
}) => {
  const { currentTheme, themeCodes } = useThemeState();

  const secondaryColor = currentTheme?.era !== "" ? themeCodes["accent-foreground"] : themeCodes["muted-foreground"];

  const COLORS = [secondaryColor, themeCodes["primary"]];

  if (!data) {
    return <div className={cn("", className)}>Loading...</div>;
  }
  console.log(data);
  return (
    <ResponsiveContainer>
      <PieChart>
        <Pie
          data={data}
          cx="55%"
          // cy="50%"
          // outerRadius={80}
          // paddingAngle={0}
          // fill="#8884d8"
          dataKey={dataKey as string}
          nameKey={nameKey}
          label={({ name, percent }) => {
            return `${name} ${(percent * 100).toFixed(0)}%`;
          }}
          // data={data}
          // cx={420}
          // cy={200}
          startAngle={180}
          endAngle={0}
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          // dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};
