"use client";
import * as React from "react";
import { useThemeState } from "@/hooks/theme-state";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer
} from 'recharts';
import { cn } from "@/lib/utils";
import { getRapData } from "@/lib/db/query-spotify-utils";

export const PieGraph = ({ initialData, className }: { initialData?: any, className?: string }) => {

    const [data, setData] = React.useState(initialData);
    const { currentTheme, themeCodes } = useThemeState();
    const COLORS = [themeCodes["accent-foreground"], themeCodes['primary']];

    React.useEffect(() => {
      let ignore = false;
      const fetchData = async () => {
        const data = await getRapData();
        console.log(data);
        setData(data);
      };

      if (!ignore) {
        fetchData();
      }

      return () => {
        ignore = true;
      };
    }, []);
    
    if (!data) {
      return <Card className={cn("", className)}>Loading...</Card>;
    }

    return (
        <Card className={cn("", className)}>
        <CardHeader>
            <CardTitle>Pie Chart</CardTitle>
            <CardDescription>Pie Chart Description</CardDescription>
        </CardHeader>
        <CardContent className="grow p-0">
            <ResponsiveContainer>
            <PieChart>
                <Pie
                    data={data}
                    cx="55%"
                    // cy="50%"
                    // outerRadius={80}
                    // paddingAngle={0}
                    // fill="#8884d8"
                    dataKey="hours_played"
                    nameKey="genre"
                    label={({ name, percent }) => {
                        return `${name} ${(percent * 100).toFixed(0)}%`;
                    }
                    }



                    // data={data}
                    // cx={420}
                    // cy={200}
                    startAngle={180}
                    endAngle={0}
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    // dataKey="value"
                    
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
            </PieChart>
            </ResponsiveContainer>
        </CardContent>
    </Card>
    )
};