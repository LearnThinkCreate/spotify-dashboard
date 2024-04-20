"use client";
import * as React from "react";
import { useThemeState } from "@/hooks/theme-state";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useScreenWidth } from "@/hooks/screen-width";
import { PieLabel, calculateSize } from "@/components/graph-custom-components";

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

  const { innerRadius, outerRadius } = getRadiusSize({
    screenWidth,
    isDesktop,
    isXlDesktop,
  });

  const secondaryColor =
    currentTheme?.era !== "all"
      ? themeCodes["accent-foreground"]
      : themeCodes["muted-foreground"];

  const COLORS = [secondaryColor, themeCodes["primary"]];

  if (!data) {
    return <div className={cn("", className)}></div>;
  }
  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
      // minHeight={isDesktop ? undefined : 200}
    >
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="75%"
          dataKey={dataKey as string}
          nameKey={nameKey}
          startAngle={180}
          endAngle={0}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          fill="#8884d8"
          paddingAngle={5}
          // @ts-ignore
          label={<PieLabel isMini={isMini} isDesktop={isDesktop} />}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

const getRadiusSize = ({ screenWidth, isDesktop, isXlDesktop }) => {
  if (!isDesktop) {
    return {
      innerRadius: 60,
      outerRadius: 80,
    };
  }

  if (isXlDesktop) {
    return {
      innerRadius: 52.5,
      outerRadius: 70,
    };
  }

  const largeDesktop = {
    minWidth: 1024,
    maxWidth: 1279,
    minOuterRadius: 40,
    maxOuterRadius: 60,
  };

  const xlDesktop = {
    minWidth: 1280,
    maxWidth: 1535,
    minOuterRadius: 40,
    maxOuterRadius: 60,
  };

  if (
    screenWidth >= largeDesktop.minWidth &&
    screenWidth <= largeDesktop.maxWidth
  ) {
    const outerRadius = calculateSize({
      maxMultiplier: largeDesktop.maxOuterRadius,
      minMultiplier: largeDesktop.minOuterRadius,
      maxScreenWidth: largeDesktop.maxWidth,
      minScreenWidth: largeDesktop.minWidth,
      screenWidth,
      steps: 10,
    });
    return {
      innerRadius: (3 / 4) * outerRadius,
      outerRadius,
    };
  }

  const outerRadius = calculateSize({
    maxMultiplier: xlDesktop.maxOuterRadius,
    minMultiplier: xlDesktop.minOuterRadius,
    maxScreenWidth: xlDesktop.maxWidth,
    minScreenWidth: xlDesktop.minWidth,
    screenWidth,
    steps: 10,
  });

  return {
    innerRadius: (3 / 4) * outerRadius,
    outerRadius,
  };
};