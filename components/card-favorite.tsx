"use client";
import * as React from "react";
import { cn, toTitleCase } from "@/lib/utils";
import {
  Card,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Image from "next/image";
import { useThemeState } from "@/hooks/theme-state";
import { useMounted } from "@/hooks/use-mounted";


export const FavoriteCard = ({
    className,  
    initialTopArtist,
    initialTopSong,
    initialTopAlbum
  }) => {
  const { currentTheme } = useThemeState();
  const [topAlbum, setTopAlbum] = React.useState(initialTopArtist) as any;
  const [topArtist, setTopArtist] = React.useState(initialTopSong);
  const [topSong, setTopSong] = React.useState(initialTopAlbum);
  const mounted = useMounted();

  React.useEffect(() => {
    if (!mounted) {
      return;
    }
    let ignore = false;
    if (!ignore) {
      const fetchData = async () => {
        const data = await fetch(`/api/top-category/${currentTheme.era}`).then((res) => res.json());
        if (!ignore) {
          setTopAlbum(data[0]);
          setTopArtist(data[1]);
          setTopSong(data[2]);
      };
    }
      fetchData();
    }
    return () => {
      ignore = true;
    };
  }, [currentTheme]);  
  return (
    <Card className={cn(`${topAlbum ? '' : 'animate-pulse'}`, className)}>
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
};
FavoriteCard.displayName = "FavoriteCard";