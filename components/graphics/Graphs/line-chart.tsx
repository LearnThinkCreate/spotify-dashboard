"use client";
import * as React from "react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip  } from "recharts";
import { formatXAxis } from "@/components/graphics/Graphs/utils";
import { LineGraphOptions } from '@/components/graphics/Graphs/options';
import { useScreenWidth } from "@/hooks/screen-width";
import { useThemeState } from "@/hooks/theme-state";

const HistoryLineChart = ({data, historyValue}: {
    data: any,
    historyValue: string
}) => {

  const option = LineGraphOptions.find(option => option.value === historyValue) 
  
  const screenWidth = useScreenWidth();
  const themeCodes = useThemeState();

  const tickStyle = {
    fontSize: screenWidth > 1024 ? '14' : (screenWidth > 768 ? '10' : '10'),
    angle: screenWidth > 1024 ? -20 : (screenWidth > 768 ? -34 : -70),
    fill: themeCodes['accent-foreground'],
  };
  
    return (
      <ResponsiveContainer>
        <LineChart
          data={JSON.parse(data)}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 0,
          }}
        >
          <Tooltip
            cursor={false}
            labelFormatter={(label: string) => formatXAxis(label).toString()}
            formatter={option.labelFormatter}
            separator=": "
            wrapperStyle={
              {
                border: "none",
              } as React.CSSProperties
            }
            contentStyle={{
              backgroundColor: "bg-transparent",
              border: "none",
              color: themeCodes["primary"],
            }}
            itemStyle={{
              color: themeCodes["primary"],
            }}
            // active={tooltipActive}
          />
          <CartesianGrid horizontal={false} vertical={false} />
          <XAxis
            dataKey="year"
            tickFormatter={(tickItem: string) =>
              formatXAxis(tickItem).toString()
            }
            padding={{ left: 20, right: 20 }}
            tickLine={false}
            tick={{ fill: themeCodes["accent-foreground"] }}
            angle={tickStyle.angle}
            fontSize={tickStyle.fontSize}
          />
          <YAxis
            name="Test"
            domain={option.scale}
            tickFormatter={option.tickFormatter}
            padding={{ top: 20, bottom: 20 }}
            tick={{ fill: themeCodes["accent-foreground"] }}
          />
          <Line
            type="monotone"
            strokeWidth={2}
            dataKey={option.lineKey}
            name={option.label}
            activeDot={{
              r: 6,
              style: { fill: themeCodes["secondary"], opacity: 0.75 },
            }}
            style={
              {
                stroke: themeCodes["primary"],
                opacity: 1,
              } as React.CSSProperties
            }
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };
  
  export default HistoryLineChart;