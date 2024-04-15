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
import { getRapData } from "@/lib/db/query-spotify-utils";
import { useThemeState } from "@/hooks/theme-state";
import { PieGraph } from "@/components/graph-pie";

export const FavoriteGenre = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {  }
>(({ className, ...props }, ref) => {

  const [data, setData] = React.useState() as any;
  const { currentTheme } = useThemeState();


  React.useEffect(() => {
    let ignore = false;
    const fetchData = async () => {
      const data = await getRapData(currentTheme);
      if (!ignore) {
        setData(data);
      }
    };

    if (!ignore) {
      fetchData();
    }

    return () => {
      ignore = true;
    };
  }, [currentTheme]);

  return (
    <Card ref={ref} className={cn(``, className)}>
          <CardHeader>
            <CardTitle className="text-center">Rap vs Non-Rap</CardTitle>
            {/* <CardDescription></CardDescription> */}
          </CardHeader>
          <CardContent className="grow">

            <PieGraph
              data={data}
              dataKey="hours_played"
              nameKey="genre"
              className="flex flex-col"
            />
          </CardContent>
    </Card>
  );
});
FavoriteGenre.displayName = "FavoriteGenre";
