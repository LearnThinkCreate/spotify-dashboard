import * as React from "react";
import { cn, toTitleCase } from "@/lib/utils";
import {
  Card,
CardHeader, 
CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  topCategory
} from "@/lib/db/query-top-category";
import { queryHoursPlayed } from "@/lib/db/query-spotify-utils";

export const FavoriteGenre = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(async ({ className, ...props }, ref) => {
    const topGenre = await topCategory({ category: "main_genre" });
    const totalHoursPlayed = await queryHoursPlayed() as number;
    const shareOfHoursPlayed = (topGenre.hours_played / totalHoursPlayed * 100).toFixed(2);

    return (
      <Card ref={ref} className={cn(``, className)}>
              <CardHeader>
        <CardTitle className="">{toTitleCase(topGenre.value)}</CardTitle>
        <CardDescription>Hours listened: {topGenre.hours_played.toFixed(0)}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <div className="w-24 h-24 relative">
          <div className="w-full h-full mask mask-radial-gradient bg-gray-300 dark:bg-gray-800" />
          <div className="absolute inset-0 flex items-center justify-center text-2xl font-semibold text-primary">{shareOfHoursPlayed}%</div>
        </div>
        </CardContent>
      </Card>
    );
});