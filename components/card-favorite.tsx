"use client";
import * as React from "react";
import { cn, toTitleCase } from "@/lib/utils";
import {
  Card,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  topCategory
} from "@/lib/db/query-top-category";
import Image from "next/image";
import { useThemeState } from "@/hooks/theme-state";
import { prismaEraFilters } from "@/lib/db/query-utils";


export const FavoriteCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { currentTheme } = useThemeState();
  const eraFilter = { ts: prismaEraFilters( currentTheme )}
  const [topAlbum, setTopAlbum] = React.useState() as any;
  const [topArtist, setTopArtist] = React.useState();
  const [topSong, setTopSong] = React.useState();

  React.useEffect(() => {
    let ignore = false;
    if (!ignore) {
      const fetchData = async () => {
        const album = topCategory({ category: "album", filter: eraFilter });
        const artist = topCategory({ category: "artist", filter: eraFilter });
        const song = topCategory({ category: "song", filter: eraFilter });
        const results = await Promise.all([
          album.then((r) => r.promise),
          artist.then((r) => r.promise),
          song.then((r) => r.promise),
        ]);
        if (!ignore) {
          setTopAlbum(results[0]);
          setTopArtist(results[1]);
          setTopSong(results[2]);
        }
      };
      fetchData();
    }
    return () => {
      ignore = true;
    };
  }, [eraFilter]);  
  return (
    <Card ref={ref} className={cn(``, className)}>
      <CardContent className="grow flex flex-col gap-4 pt-6">
      {topAlbum && topSong && topArtist ? (
        [topArtist, topAlbum, topSong].map((top) => (
          <div className="flex flex-row justify-between" key={`favorite-${top.category}`}>
            <div>
              <div className="text-lg font-semibold tracking-tigght">
                Top {toTitleCase(top.category)}
              </div>
              <CardDescription>{toTitleCase(top.value)}</CardDescription>
            </div>
            <Image
              className="w-16 h-auto aspect-square rounded-lg border"
              height={top.image_sm.height}
              width={top.image_sm.width}
              src={top.image_sm.url}
              alt={top.value}
            />
          </div>
        ))
      ) : null}

      </CardContent>
    </Card>
  );
});
FavoriteCard.displayName = "FavoriteCard";