import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  getTopArtist,
  getTopSong,
  getTopAlbum,
  topQuery,
  getImageDict,
  getMetadata,
} from "@/lib/db/data-core-card";
import Image from "next/image";

export const AlbumCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(async ({ className, ...props }, ref) => {
  const topAlbum = await getTopAlbum();
  const topArtist = await getTopArtist();
  const topSong = await getTopSong();

  return (


    // <div className="text-wrap">
    //     {JSON.stringify(topAlbum.image_sm)}
    // </div>
    <Card
      ref={ref}
      className={cn(
        `
            flex flex-col shadow-primary
            shadow-md sm:p-1 md:p-2
            `,
        className
      )}
    >
      <CardContent className="grow flex flex-col gap-10 p-0">
        <div className="flex flex-row justify-between">
          <div>
            <CardTitle>Top Album</CardTitle>
            <CardDescription>{topAlbum.album}</CardDescription>
          </div>
          {/* <div className="container"> */}
          <img
            className="h-auto w-auto aspect-square rounded-lg border"
            height={topAlbum.image_sm.height}
            width={topAlbum.image_sm.width}
            src={topAlbum.image_sm.url}
            alt={topAlbum.song}
          />
          {/* </div> */}
        </div>

        <div className="flex flex-row justify-between">
          <div>
            <CardTitle>Top Artist</CardTitle>
            <CardDescription>{topArtist.artist}</CardDescription>
          </div>
          <img
            className="h-40 w-auto aspect-square"
            src={topArtist.image_sm.url}
            alt={topArtist.artist}
            width={topArtist.image_sm.width}
            height={topArtist.image_sm.height}
          />
        </div>

        <div className="flex flex-row justify-between">
          <div>
            <CardTitle>Top Song</CardTitle>
            <CardDescription>{topSong.song}</CardDescription>
          </div>
          <img
            className="h-40 w-auto aspect-square"
            src={topSong.image_sm.url}
            alt={topSong.song}
          />
        </div>
      </CardContent>
    </Card>
  );
});
