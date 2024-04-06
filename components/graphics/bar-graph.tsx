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
import { BarGraphOptions } from "@/components/graphics/options";
import { useConfig } from "@/hooks/use-config";
import { prismaGenreFilters, eraFilters } from "@/lib/navigation-utils";
import { GenreSearch, GenreResult } from "@/components/genre-search";
import { GenreBadges, Genre } from "@/components/genre-badges";
import { themes, getHexCodes } from "@/components/themes";
import { useScreenWidth } from "@/hooks/screen-width";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from "recharts";
import {
  WrappedXAxisTick,
  CircleBarLabel,
} from "@/components/graphics/graph-components";
import { useTheme } from "next-themes";

export const BarGraph = ({ initialData }: { initialData? }) => {
  const [data, setData] = React.useState(initialData);
  const [dropdownValue, setDropdownValue] = React.useState(
    BarGraphOptions[0].value
  );
  const [mainGenre, setMainGenre] = React.useState<Genre[]>([]);
  const [secondaryGenre, setSecondaryGenre] = React.useState<Genre[]>([]);
  const { theme: mode } = useTheme();
  const [config, setConfig] = useConfig();
  const theme = themes.find((theme) => theme.name === config.theme);
  const themeCodes = getHexCodes(theme, mode);

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const isLargeDesktop = useMediaQuery("(min-width: 1024px)");
  const screenWidth = useScreenWidth();

  function updateGenreArray(genreType: string, genreArray: Genre[]) {
    if (genreType === "main_genre") {
      setMainGenre(genreArray);
      return;
    }
    setSecondaryGenre(genreArray);
  }

  function handleGenreFilter(genre: GenreResult) {
    const isMainGenre = genre.genre_type === "main_genre";
    const currentGenreArray = isMainGenre ? mainGenre : secondaryGenre;

    // Find the index of the genre to be updated/removed
    const genreIndex = currentGenreArray.findIndex(
      (g) => g.genre === genre.genre
    );

    if (genreIndex !== -1) {
      // Step 1: Trigger the animation by updating the state with a new array
      // Create a new array with the 'removed' property set to true for the targeted item
      const updatedGenreArray = currentGenreArray.map((g, index) => {
        if (index === genreIndex) {
          return { ...g, removed: true }; // Spread operator creates a new object
        }
        return g;
      });

      // Update the state to trigger the animation
      updateGenreArray(genre.genre_type, updatedGenreArray);

      // Step 2: Remove the item from the array after the animation completes
      setTimeout(() => {
        const newArray = updatedGenreArray.filter(
          (_, index) => index !== genreIndex
        );
        updateGenreArray(genre.genre_type, newArray);
      }, 200);
    } else {
      // Add a new genre if it doesn't exist
      updateGenreArray(genre.genre_type, [
        ...currentGenreArray,
        { genre: genre.genre, genre_type: genre.genre_type },
      ]);
    }
  }

  const fetchData = async () => {
    const getGenres = (genres: Genre[]) => genres.map((genre) => genre.genre);

    const response = await fetch(
      `api/aggregate?query=${JSON.stringify({
        by: [dropdownValue],
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
              ts: eraFilters(theme),
            },
            {
              OR: prismaGenreFilters({
                main_genre: getGenres(mainGenre),
                secondary_genre: getGenres(secondaryGenre),
              }),
            },
          ],
        },
        take: 10,
      })}`
    );
    const data = await response.json();
    const transformedData = data.map((item) => ({
      [option.value]: item[option.value],
      hours_played: item._sum.hours_played,
    }));
    setData(transformedData);
  };

  React.useEffect(() => {
    fetchData();
  }, [dropdownValue, mainGenre, secondaryGenre, config]);

  const option = BarGraphOptions.find(
    (option) => option.value === dropdownValue
  );

  const maxLabelLength = data
    ? Math.max(...data.map((item) => item[option.value]?.length))
    : 0;
  let marginBottom;
  if (maxLabelLength < 10) {
    marginBottom = 15;
  } else if (maxLabelLength < 20) {
    marginBottom = 65;
  } else {
    marginBottom = 80;
  }

  return (
    <Card className="flex flex-col flex-1">
      <CardHeader>
        <div className="flex flex-col gap-5 lg:gap-0 lg:flex-row justify-between items-center">
          <div>
            <CardTitle>Test</CardTitle>
            <CardDescription>{option.description}</CardDescription>
          </div>
          <div className="flex flex-col lg:flex-row gap-5">
            <GenreBadges
              mainGenre={mainGenre}
              secondaryGenre={secondaryGenre}
              onBadgeClick={handleGenreFilter}
            />
            <div className="flex flex-row gap-5 order-1 lg:order-2">
              <GenreSearch onGenreSelect={handleGenreFilter} />
              <GraphDropDown
                options={BarGraphOptions}
                value={dropdownValue}
                onValueChange={setDropdownValue}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        {data && (
          <ResponsiveContainer>
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 0,
                left: 0,
                bottom: isDesktop ? marginBottom : marginBottom + 20,
              }}
            >
              <CartesianGrid horizontal={false} vertical={false} />
              <Bar
                dataKey={"hours_played"}
                name={option.label}
                style={
                  {
                    fill: themeCodes["primary"],
                    opacity: 1,
                  } as React.CSSProperties
                }
                label={
                  <CircleBarLabel
                    isLargeDesktop={isLargeDesktop}
                    screenWidth={screenWidth}
                    themeCodes={themeCodes}
                  />
                }
                isAnimationActive={true}
              />
              <XAxis
                dataKey={option.value}
                padding={{ left: 5, right: 5 }}
                type="category"
                tickLine={false}
                tickCount={10}
                tick={
                  <WrappedXAxisTick
                    isDesktop={isDesktop}
                    themeCodes={themeCodes}
                    screenWidth={screenWidth}
                    tickFormatter={option.tickFormatter}
                  />
                }
                minTickGap={0}
                interval={0}
                allowDataOverflow={true}
              />
              <YAxis
                name="Test"
                domain={option.scale}
                tickFormatter={
                  option.tickFormatter ? option.tickFormatter : undefined
                }
                padding={{ top: 5, bottom: 10 }}
                tick={{
                  fontSize: "10",
                  fill: themeCodes["accent-foreground"],
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
