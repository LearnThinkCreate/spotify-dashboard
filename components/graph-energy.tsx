"use client";
import React from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import {
   Card,
   CardContent,
   CardHeader,
   CardTitle,
   CardDescription,
} from "@/components/ui/card";
import { useThemeState } from "@/hooks/theme-state";
import { getEnergyLevel } from "@/lib/db/query-spotify-energy";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import clsx from "clsx";

export const EnergyCard = () => {
   const { currentTheme, themeCodes } = useThemeState();

   const [data, setData] = React.useState<any>();

   React.useEffect(() => {
      let ignore = false;
      const updateData = async () => {
         const data = await getEnergyLevel(currentTheme);
         if (!ignore) {
            setData(data);
         }
      };
      updateData();
      return () => {
         ignore = true;
      };
   }, [currentTheme]);

   return (
      <Card className="grow flex flex-col">
         <CardHeader>
            <div className="flex justify-between">
               <CardTitle>Energy</CardTitle>
               {data ? (
                  <div
                     className={clsx(
                        "flex flex-row gap-2 items-center",
                        data?.delta === 0
                           ? ""
                           : data?.delta > 0
                           ? "text-green-500"
                           : "text-red-500"
                     )}
                  >
                     {data?.delta === 0 ? (
                        <>{data?.value}%</>
                     ) : (
                        <>
                           {data?.delta > 0 ? <FaArrowUp /> : <FaArrowDown />}
                           {data?.delta}%
                        </>
                     )}
                  </div>
               ) : null}
            </div>
            {/* <CardDescription>Energy - {data?.value}%</CardDescription> */}
         </CardHeader>
         <CardContent className="grow flex flex-col">
            {data && (
               <ResponsiveContainer>
                  <BarChart data={data.data}>
                     <XAxis hide={true} dataKey="value" tick={false} />
                     <YAxis hide={true} tick={false} />
                     <Bar
                        dataKey="value"
                        radius={[10, 10, 0, 0]}
                        barSize={20}
                        style={
                           {
                              fill: themeCodes["primary"],
                              opacity: 1,
                           } as React.CSSProperties
                        }
                     />
                  </BarChart>
               </ResponsiveContainer>
            )}
         </CardContent>
      </Card>
   );
};
