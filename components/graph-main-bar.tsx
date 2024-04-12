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
import { BarGraphOptions } from "@/components/graph-options";
import { prismaGenreFilters, prismaEraFilters } from "@/lib/db/query-utils";
import { GenreSearch, GenreResult } from "@/components/genre-search";
import { GenreBadges, Genre } from "@/components/genre-badges";
import { useScreenWidth } from "@/hooks/screen-width";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  WrappedXAxisTick,
  CircleBarLabel,
  MobileBarLabel,
} from "@/components/graph-custom-components";
import { useThemeState } from "@/hooks/theme-state";
import { cn } from "@/lib/utils";
import { sdoGroupBy } from "@/lib/db/query-spotify-utils";

export const BarGraph = ({ className }: { className?: string }) => {
  const [data, setData] = React.useState();
  const [dropdownValue, setDropdownValue] = React.useState(
    BarGraphOptions[0].value
  );
  const [mainGenre, setMainGenre] = React.useState<Genre[]>([]);
  const [secondaryGenre, setSecondaryGenre] = React.useState<Genre[]>([]);
  const { currentTheme, themeCodes } = useThemeState();

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const isLargeDesktop = useMediaQuery("(min-width: 1024px)");
  const screenWidth = useScreenWidth();

  const option =
    BarGraphOptions.find((option) => option.value === dropdownValue) ||
    BarGraphOptions[0];

  const maxLabelLength = getMaxLabelLength(data, option);
  const marginBottom = getMarginBottom(maxLabelLength);

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

  React.useEffect(() => {
    let ignore = false;
    if (!ignore) {
      const updateData = async () => {
        const data = await fetchData(
          dropdownValue,
          mainGenre,
          secondaryGenre,
          currentTheme
        );
        setData(data);
      };
      updateData();
    }
    return () => {
      ignore = true;
    };
  }, [dropdownValue, mainGenre, secondaryGenre, currentTheme]);

  return (
    <Card className={cn("", className)}>
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
            <div className="flex flex-row flex-wrap gap-5 order-1 lg:order-2">
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
      <CardContent className="grow flex flex-col">
        {data && (
          // <div className="size-full flex-none">
          <ResponsiveContainer>
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 0,
                left: 0,
                bottom: marginBottom,
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
                  isDesktop ? (
                    <CircleBarLabel
                      isLargeDesktop={isLargeDesktop}
                      screenWidth={screenWidth}
                      themeCodes={themeCodes}
                    />
                  ) : (
                    <MobileBarLabel themeCodes={themeCodes} />
                  )
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
          // </div>
        )}
      </CardContent>
    </Card>
  );
};

const getMaxLabelLength = (data, option) => {
  if (!data) return 0;
  return Math.max(...data.map((item) => item[option.value]?.length));
};

const getMarginBottom = (maxLabelLength) => {
  if (maxLabelLength < 10) {
    return 15;
  } else if (maxLabelLength < 20) {
    return 65;
  }
  return 80;
};

const fetchData = async (
  dropdownValue,
  mainGenre,
  secondaryGenre,
  currentTheme
) => {
  const getGenres = (genres) => genres.map((genre) => genre.genre);
  const data = await sdoGroupBy({
    by: [dropdownValue] as any,
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
          ts: prismaEraFilters(currentTheme as any),
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
  });
  return data.map((item) => ({
    [dropdownValue]: item[dropdownValue],
    hours_played: item._sum.hours_played,
  }));
};
