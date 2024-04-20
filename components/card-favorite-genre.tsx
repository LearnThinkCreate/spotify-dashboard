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
import { useThemeState } from "@/hooks/theme-state";
import { PieGraph } from "@/components/graph-pie";
import { useMounted } from "@/hooks/use-mounted";

export const FavoriteGenre = ({ className, initialData }) => {

  const [data, setData] = React.useState(initialData) as any;
  const { currentTheme } = useThemeState();
  const mounted = useMounted();


  React.useEffect(() => {
    if (!mounted) {
      return;
    }
    let ignore = false;
    const fetchData = async () => {
      const data = await fetch(`/api/rap-data/${currentTheme.era}`).then((res) => res.json());
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
    <Card className={cn(data ? '' : 'animate-pulse', className)}>
          <CardHeader>
            <CardTitle className="text-center">Rap vs Non-Rap</CardTitle>
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
};
FavoriteGenre.displayName = "FavoriteGenre";
