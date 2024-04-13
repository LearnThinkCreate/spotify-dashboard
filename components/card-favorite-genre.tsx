"use client";
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
import { useThemeState } from "@/hooks/theme-state";



export const FavoriteGenre = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
  { totalHoursPlayed: number }
>(({ className, totalHoursPlayed, ...props }, ref) => {
    const { currentTheme } = useThemeState();

    const [topGenre, setTopGenre] = React.useState() as any;
    React.useEffect(() => {
        let ignore = false;
        const fetchData = async () => {
            let totalHoursPlayed = await queryHoursPlayed() as number;
        };
        if (!ignore) {
        fetchData();
        }
        return () => {
            ignore = true;
        };
    }, []);
    let shareOfHoursPlayed = topGenre && (topGenre.hours_played / totalHoursPlayed * 100).toFixed(2);


    // const topGenre = await topCategory({ category: "main_genre" });
    // const totalHoursPlayed = await queryHoursPlayed() as number;
    // const shareOfHoursPlayed = (topGenre.hours_played / totalHoursPlayed * 100).toFixed(2);
    React.useEffect(() => {
        let ignore = false;
        const fetchData = async () => {
            const genre = await topCategory({ category: "main_genre" }).then((r) => r.promise);
            if (!ignore) {
                setTopGenre(genre);
            }
        }
        fetchData();
        return () => {
            ignore = true;
        };
    }, [currentTheme]);

    return (
        <Card ref={ref} className={cn(``, className)}>
            {
                topGenre && (
                    <>                    <CardHeader>
              <CardTitle className="">{toTitleCase(topGenre.value)}</CardTitle>
              <CardDescription>Hours listened: {topGenre.hours_played.toFixed(0)}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <div className="w-24 h-24 relative">
                <div className="w-full h-full mask mask-radial-gradient bg-gray-300 dark:bg-gray-800" />
                <div className="absolute inset-0 flex items-center justify-center text-2xl font-semibold text-primary">{shareOfHoursPlayed}%</div>
              </div>
              </CardContent>
              </>
                )
            
            }
              </Card>
    //   <Card ref={ref} className={cn(``, className)}>
    //           <CardHeader>
    //     <CardTitle className="">{toTitleCase(topGenre.value)}</CardTitle>
    //     <CardDescription>Hours listened: {topGenre.hours_played.toFixed(0)}</CardDescription>
    //   </CardHeader>
    //   <CardContent className="flex items-center justify-center">
    //     <div className="w-24 h-24 relative">
    //       <div className="w-full h-full mask mask-radial-gradient bg-gray-300 dark:bg-gray-800" />
    //       <div className="absolute inset-0 flex items-center justify-center text-2xl font-semibold text-primary">{shareOfHoursPlayed}%</div>
    //     </div>
    //     </CardContent>
    //   </Card>
    );
});
FavoriteGenre.displayName = "FavoriteGenre";