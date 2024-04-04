import * as React from "react";
import query from "@/lib/db";
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

export default async function Page({
  searchParams
}) {
  const option = (
    searchParams.categoryValue 
    ? BarGraphOptions.find(option => option.value === searchParams.categoryValue) 
    : BarGraphOptions[0]
    );

  const era = themes.find(theme => theme.era === (searchParams.era || '')) || themes[0];
  const genreFilters = getGenreFilters({main_genre: searchParams.main_genre, secondary_genre: searchParams.secondary_genre});
  const filterString = `${getEraFilters(era)} ${getEraFilters(era) && genreFilters ? 'AND' : ''} ${genreFilters}`.trim();

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


  const genreOptions = await getGenreOptions(searchParams.genreQuery);
  const searchKey = `${searchParams.categoryValue || ''}-${filterString}`

  return (
    <>
        <div className="flex flex-col flex-1 p-4">
          <MenuBar />
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

const formatFilterParam = (filter) => Array.isArray(filter) ? filter : (filter ? [filter] : []);

const getGenreFilters = ({ main_genre, secondary_genre }) => {
  const mainGenreFilters = formatFilterParam(main_genre).map(genre => `main_genre = '${genre}'`).join(' OR ');
  const secondaryGenreFilters = formatFilterParam(secondary_genre).map(genre => `secondary_genre = '${genre}'`).join(' OR ');
  
  let filters = [];
  if (mainGenreFilters) filters.push(`${mainGenreFilters}`);
  if (secondaryGenreFilters) filters.push(`${secondaryGenreFilters}`);

  return filters.join(' OR ');
}

const getGenreOptions = async (genreQuery: string) => {
  const formatGenreQuery = (genre_type: string = 'main_genre', genreQuery: string) => ( `
    select 
    ${genre_type} as genre,
    '${genre_type}' as genre_type
    from 
    spotify_data_overview
    ${
      genreQuery ? `where ${genre_type} ilike '%${genreQuery}%'` : ''
    }
    group by ${genre_type}
    order by SUM(hours_played) DESC
    limit 10
  `)

  const main_genres = await query(formatGenreQuery('main_genre', genreQuery));
  const sub_genres = await query(formatGenreQuery('secondary_genre', genreQuery));

  let genres;
  if (main_genres.rows.length >= 5 && sub_genres.rows.length >= 5) {
    genres = main_genres.rows.slice(0, 5).concat(sub_genres.rows.slice(0, 5));
  } else if (main_genres.rows.length >= 5) {
    // genres = main_genres.rows.slice(0, 10 - sub_genres.rows.length).concat(sub_genres.rows);
    genres = sub_genres.concat(main_genres.rows.slice(0, 10 - sub_genres.rows.length));
  } else {
    genres = main_genres.rows.concat(sub_genres.rows.slice(0, 10 - main_genres.rows.length));
  }

  return genres;
}

const getEraFilters = (era: Theme) => {
  const filters = [];
  if (era.minDate) filters.push(`ts >= '${era.minDate}'`);
  if (era.maxDate) filters.push(`ts < '${era.maxDate}'`);
  return filters.join(' AND ');
}

const eraFilters = (era: Theme) => {
  const filters = {};
  if (era.minDate) filters['gte'] = era.minDate;
  if (era.maxDate) filters['lt'] = era.maxDate;
  return filters;
}

const prismaGenreFilters = ({ main_genre, secondary_genre }) => {
  const filters = [];
  if (main_genre) filters.push({ main_genre: { in: formatFilterParam(main_genre) } });
  if (secondary_genre) filters.push({ secondary_genre: { in: formatFilterParam(secondary_genre) } });
  return filters;
}