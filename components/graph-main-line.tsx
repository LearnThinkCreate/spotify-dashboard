"use client";
import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { GraphDropDown } from "@/components/graph-dropdown";
import { LineGraphOptions } from '@/components/graph-options';
import { useConfig } from "@/hooks/use-config";
import { themes, getHexCodes } from "@/components/themes";
import { useScreenWidth } from "@/hooks/screen-width";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip  } from "recharts";
import { getShortMonthYear } from "@/components/graph-utils";
import { WrappedXAxisTick } from "@/components/graph-custom-components";
import { useTheme } from "next-themes";
import { useThemeState } from "@/hooks/theme-state";
import { cn } from "@/lib/utils";

export const LineGraph = ({ initialData, className }: { initialData?; className?: string }) => {
    const [data, setData] = React.useState(initialData);
    const [dropdownValue, setDropdownValue] = React.useState(
      LineGraphOptions[0].value
    );

    const { theme: mode } = useTheme();
    const [config] = useConfig();
    const { currentTheme, themeCodes } = useThemeState();

    const option = LineGraphOptions.find(
        (option) => option.value === dropdownValue
        ) || LineGraphOptions[0];;

    const screenWidth = useScreenWidth();
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const tickStyle = {
        fontSize: screenWidth > 1024 ? '14' : (screenWidth > 768 ? '10' : '10'),
        angle: screenWidth > 1024 ? -20 : (screenWidth > 768 ? -34 : -70),
        fill: themeCodes['accent-foreground'],
      };

    const fetchData = async () => {
        const response = await fetch(`api/graph-line-data?category=${dropdownValue}&era=${JSON.stringify(currentTheme)}`);
        const data = await response.json();
        setData(data);
    }

    React.useEffect(() => {
        fetchData();
    }, [dropdownValue, config]);

    const [tooltipDisabled, setTooltipDisabled] = React.useState(false);
    React.useEffect(() => {
      setTooltipDisabled(true);
      setTimeout(() => {
        setTooltipDisabled(false);
      }, 1000);
    }, [dropdownValue]);

    return (
      <Card className={cn("", className)}>
        <CardHeader>
          <div className="flex flex-col gap-5 lg:flex-row lg:gap-0 justify-between items-center">
            <div>
              <CardTitle className="text-center lg:text-justify">
                {option.label}
              </CardTitle>
              <CardDescription>{option.description}</CardDescription>
            </div>
            <GraphDropDown
              options={LineGraphOptions}
              value={dropdownValue}
              onValueChange={setDropdownValue}
            />
          </div>
        </CardHeader>
        <CardContent className="grow flex flex-col">
          {data && (
            <ResponsiveContainer>
              <LineChart
                data={data}
                margin={{
                  top: 5,
                  right: 10,
                  left: 10,
                  bottom: 30,
                }}
              >
                <Tooltip
                  cursor={false}
                  labelFormatter={(label: string) =>
                    getShortMonthYear(label)
                  }
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
                  active={!tooltipDisabled ? undefined : false}
                />
                <CartesianGrid horizontal={false} vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(tickItem: string) =>
                    getShortMonthYear(tickItem)
                  }
                  padding={{ left: 20, right: 20 }}
                  tickLine={false}
                  tick={
                    <WrappedXAxisTick
                      isDesktop={isDesktop}
                      themeCodes={themeCodes}
                      screenWidth={screenWidth}
                      tickFormatter={getShortMonthYear}
                    />
                  }
                  angle={tickStyle.angle}
                //   fontSize={tickStyle.fontSize}
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
                  dataKey={"average_value"}
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
          )}
        </CardContent>
      </Card>
    );
}