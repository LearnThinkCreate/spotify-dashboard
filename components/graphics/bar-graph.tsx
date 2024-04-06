"use client";
import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import HistoryBarChart from "@/components/graphics/bar-chart";
import { GraphDropDown } from "@/components/graph-dropdown";
import { BarGraphOptions } from "@/components/graphics/options";
import { useConfig } from "@/hooks/use-config";
import { prismaGenreFilters, eraFilters } from "@/lib/navigation-utils";
import { GenreSearch, GenreResult } from "@/components/genre-search";
import { GenreBadges, Genre } from "@/components/genre-badges";
import { useThemeState } from "@/hooks/theme-state";
import { themes, Theme, getHexCodes } from "@/components/themes";

export const BarGraph = ({ initialData }: { initialData? }) => {
  const [data, setData] = React.useState(initialData);
  const [dropdownValue, setDropdownValue] = React.useState(
    BarGraphOptions[0].value
  );
  const [mainGenre, setMainGenre] = React.useState<Genre[]>([]);
  const [secondaryGenre, setSecondaryGenre] = React.useState<Genre[]>([]);
  // const [config, setConfig] = useConfig();
  // const theme = themes.find((theme) => theme.name === config.theme);
  const renderCount = React.useRef(0);

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
      }, 200); // Adjust 1000ms to match your animation duration
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
              // ts: eraFilters(theme),
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
    // fetchData();
    console.log("useEffect called");
  }, []);

  const option = BarGraphOptions.find(
    (option) => option.value === dropdownValue
  );

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
            <HistoryBarChart
              data={data}
              categroyValue={dropdownValue}
              option={option}
            />
          )}
      </CardContent>
    </Card>
  );
};
