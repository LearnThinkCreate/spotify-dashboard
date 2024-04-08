import * as React from "react";
import { cn, toTitleCase } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  topCategory
} from "@/lib/db/query-top-category";


export const FavoriteCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(async ({ className, ...props }, ref) => {
  const topAlbum = await topCategory({ category: "album" });
  const topArtist = await topCategory({ category: "artist" });
  const topSong = await topCategory({ category: "song" });

  return (
    <Card ref={ref} className={cn(``, className)}>
      <CardContent className="grow flex flex-col gap-4 pt-6">
        {[topArtist, topAlbum, topSong].map((top) => (
          <div className="flex flex-row justify-between" key={`favorite-${top.category}`}>
            <div>
              <div className="text-lg font-semibold tracking-tigght">
                Top {toTitleCase(top.category)}
              </div>
              <CardDescription>{toTitleCase(top.value)}</CardDescription>
            </div>
            <img
              className="w-14 h-auto aspect-square rounded-lg border"
              height={top.image_sm.height}
              width={top.image_sm.width}
              src={top.image_sm.url}
              alt={top.value}
            />
          </div>
        ))}

      </CardContent>
    </Card>
  );
});
