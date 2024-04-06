import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import GraphDropDown from "@/components/graphics/graph-dropdown";
import  { BarGraphOptions } from "@/components/graphics/options";
import { EraFilter } from "@/components/era-filter";
import { ThemeWrapper } from "@/components/theme-wrapper";
import HistoryBarChart from "@/components/graphics/bar-chart";
import { GenreSearch } from "@/components/genre-search";
import { GenreBadges } from "@/components/genre-badges";
import { themes, Theme } from "@/components/themes";
import prisma from "@/lib/db/prisma";
import { prismaGenreFilters, prismaGenreOptions, eraFilters } from "@/lib/navigation-utils";
import { BarGraph } from "@/components/graphics/bar-graph";

export default async function Page({}) {
  return (
    <>
        <div className="flex flex-col flex-1 p-4">
          <EraFilter />
          <ThemeWrapper className="flex flex-1">
            <BarGraph  />
          </ThemeWrapper>
        </div>
    </>
  );
}