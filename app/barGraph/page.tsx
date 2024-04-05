import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import GraphDropDown from "@/components/graphics/Graphs/graph-dropdown";
import  { BarGraphOptions } from "@/components/graphics/Graphs/options";
import { EraFilter } from "@/components/era-filter";
import { ThemeWrapper } from "@/components/theme-wrapper";
import { MenuBar } from "@/components/menu-bar";
import HistoryBarChart from "@/components/graphics/Graphs/bar-chart";
import { DropdownMenuDemo } from "@/components/genre-search";
import { GenreBadges } from "@/components/genre-badges";
import { themes, Theme } from "@/components/themes";
import prisma from "@/lib/db/prisma";
import { prismaGenreFilters, prismaGenreOptions, eraFilters } from "@/lib/navigation-utils";

export default async function Page({
  searchParams
}) {
  const option = (
    searchParams.categoryValue 
    ? BarGraphOptions.find(option => option.value === searchParams.categoryValue) 
    : BarGraphOptions[0]
    );

  const era = themes.find(theme => theme.era === (searchParams.era || '')) || themes[0];
  const filterString = `era-${searchParams.era}-main genres ${searchParams.main_genre}-secondary genres ${searchParams.secondary_genre}`.trim();
  
  const data = await prisma.spotify_data_overview.groupBy({
    by: [option.value || 'artist' as any],
    _sum: {
      hours_played: true,
    },
    orderBy: {
      _sum: {
        hours_played: "desc",
      },
    },
    where: {
      AND: [
        {
          ts: eraFilters(era)
        },
        {
          OR: prismaGenreFilters({main_genre: searchParams.main_genre, secondary_genre: searchParams.secondary_genre})
        }
      ]
    },
    take: 10,
  });
  const transformedData = data.map(item => ({
    [option.value]: item[option.value],
    hours_played: item._sum.hours_played
  }));

  const genreOptions = await prismaGenreOptions(searchParams.genreQuery);

  const searchKey = `${searchParams.categoryValue || ''}-${filterString}`


  return (
    <>
        <div className="flex flex-col flex-1 p-4">
          <EraFilter />
          <ThemeWrapper className="flex flex-1">
          <Card className="flex flex-col flex-1">
              <CardHeader>
              <div className="flex flex-col gap-5 lg:gap-0 lg:flex-row justify-between items-center"> 
                <div>
                <CardTitle>Test</CardTitle>
                <CardDescription>{option.description}</CardDescription>
                </div>
                <div className="flex flex-col lg:flex-row gap-5">
                  <GenreBadges />
                  <div className="flex flex-row gap-5 order-1 lg:order-2">
                  <DropdownMenuDemo genres={genreOptions} />
                  <GraphDropDown paramValue="categoryValue" />
                  </div>
                </div>
                </div>
              </CardHeader>             
            <CardContent className="flex-1">
              <React.Suspense fallback={<div>Loading...</div>}>
                <HistoryBarChart
                  data={JSON.stringify(transformedData)}
                  categroyValue={ option.value }
                  searchKey={searchKey}
                />
              </React.Suspense>
            </CardContent>
          </Card>
          </ThemeWrapper>
        </div>
    </>
  );
}