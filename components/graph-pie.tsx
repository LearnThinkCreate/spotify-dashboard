"use client";
import * as React from "react";
import { useThemeState } from "@/hooks/theme-state";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useScreenWidth } from "@/hooks/screen-width";
import * as recharts from "recharts";

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


  const isXlDesktop = useMediaQuery("(min-width: 1536px)");
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isMini = useMediaQuery("(max-width: 400px)");
  const screenWidth = useScreenWidth();

  const { innerRadius, outerRadius } = getRadiusSize({ screenWidth, isDesktop, isXlDesktop });

  const secondaryColor =
    currentTheme?.era !== ""
      ? themeCodes["accent-foreground"]
      : themeCodes["muted-foreground"];

  const COLORS = [secondaryColor, themeCodes["primary"]];

  if (!data) {
    return <div className={cn("", className)}>Loading...</div>;
  }

  return (
    <ResponsiveContainer 
      width="100%" 
      height="100%" 
      minHeight={isDesktop ? undefined : 200}
    >
      <PieChart
      // margin={{ top: 5, right: 30, bottom: 5, left: 30 }}
      >
        <Pie
          data={data}
          cx="50%"
          cy="75%"
          // outerRadius={80}
          // paddingAngle={0}
          // fill="#8884d8"
          dataKey={dataKey as string}
          nameKey={nameKey}
          // label={({ name, percent }) => {
          //   return `${name} ${(percent * 100).toFixed(0)}%`;
          // }}

          // @ts-ignore
          label={<PieLabel isMini={isMini} isDesktop={isDesktop}/>}
          // label={<TestLabel/>}
          // data={data}
          // cx={420}
          // cy={200}
          startAngle={180}
          endAngle={0}
          // innerRadius={30}
          // outerRadius={40}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
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

const calculateSize = ({
  maxMultiplier,
  minMultiplier,
  maxScreenWidth,
  minScreenWidth,
  screenWidth,
  steps=10
}) => (
  maxMultiplier -
  ((maxMultiplier - minMultiplier) / steps) *
    (steps / (maxScreenWidth - minScreenWidth)) *
    (maxScreenWidth - screenWidth)
  
)


const getRadiusSize = ({ screenWidth, isDesktop, isXlDesktop }) => {
  if (!isDesktop) {
    return {
      innerRadius: 60,
      outerRadius: 80,
    }
  }

  if (isXlDesktop) {
    return {
      innerRadius: 52.5,
      outerRadius: 70,
    }
  }

  const largeDesktop = {
    minWidth: 1024,
    maxWidth: 1279,
    minOuterRadius: 40,
    maxOuterRadius: 60,
  }

  const xlDesktop = {
    minWidth: 1280,
    maxWidth: 1535,
    minOuterRadius: 40,
    maxOuterRadius: 60,
  }

  if (screenWidth >= largeDesktop.minWidth && screenWidth <= largeDesktop.maxWidth) {
    const outerRadius = calculateSize({
      maxMultiplier: largeDesktop.maxOuterRadius,
      minMultiplier: largeDesktop.minOuterRadius,
      maxScreenWidth: largeDesktop.maxWidth,
      minScreenWidth: largeDesktop.minWidth,
      screenWidth,
      steps: 10
    });
    return {
      innerRadius: (3/4) * outerRadius,
      outerRadius,
    }
  }

  const outerRadius = calculateSize({
    maxMultiplier: xlDesktop.maxOuterRadius,
    minMultiplier: xlDesktop.minOuterRadius,
    maxScreenWidth: xlDesktop.maxWidth,
    minScreenWidth: xlDesktop.minWidth,
    screenWidth,
    steps: 10
  });

  return {
    innerRadius: (3/4) * outerRadius,
    outerRadius,
  }

};


const TestLabel = ({...props}: recharts.PieLabelRenderProps) => {
  console.log(props);
  return <></>;
}


const PieLabel = ({
  x,
  y,
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
  fill,
  maxRadius,
  isMini,
  isDesktop,
  middleRadius
}) => {
  let fontSize;

  if (isDesktop) {
    fontSize = "14";
  } else if (isMini) {
    fontSize = "12";
  } else {
    fontSize = "16";
  }

  const charWidth = fontSize * 0.65;
  const labelWidth = (percent * 100).toFixed(0).length * 10;

  if (x < cx) {
    x += labelWidth / 2;
  } else {
    x -= labelWidth / 2;
  }

  let defaultDelta = 0;
  let nameDelta = 0;
  let nameLength = name.length * charWidth;
  if (x < cx) {
    if ((x + 5) -  nameLength < 0) {

      nameDelta = nameLength - x;
    }
  } else {
    if (
      (nameLength + x + defaultDelta) > (cx * 2)
    ) {
      nameDelta = ((nameLength + x + defaultDelta) - (cx * 2)) * -1;
    }
  }

  return (
    <>
      <PieLabelText 
        word={name as string} 
        ydelta={-20}
        x={x}
        y={y}
        cx={cx}
        fill={fill}
        fontSize={fontSize}
        xdelta={nameDelta}
      />
      <PieLabelText
        word={`${((percent as number) * 100).toFixed(0)}%`}
        xdelta={0}
        x={x}
        y={y}
        cx={cx}
        fill={fill}
        fontSize={fontSize}
      />
    </>
  );
};


const PieLabelText = ({
  word,
  ydelta = 0,
  xdelta = 0,
  x=0,
  y=0,
  cx=0,
  fill="",
  fontSize=14
}: {
  word: string;
  ydelta?: number;
  xdelta?: number;
  x?: number;
  y?: number;
  cx?: number;
  fill?: string;
  fontSize?: number;
}) => (
  <>
    <text
      x={x + xdelta}
      y={y - 8 + ydelta}
      fill={fill}
      textAnchor={x < cx ? "end" : "start"}
      dominantBaseline="middle"
      fontSize={fontSize}
    >
      {word}
    </text>
  </>
);