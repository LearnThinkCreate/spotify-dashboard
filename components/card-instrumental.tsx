"use client";
import React from "react";
import { useThemeState } from "@/hooks/theme-state";
import { Theme } from "@/components/themes";
import { getInstrumentalData } from "@/lib/db/query-spotify-utils";
import {
   Card,
   CardContent,
   CardHeader,
   CardTitle,
   CardDescription,
   CardFooter,
} from "@/components/ui/card";
import { CiCoffeeCup } from "react-icons/ci";
import { PiMaskSadFill } from "react-icons/pi";
import { MdAutoGraph } from "react-icons/md";
import { FaDumbbell } from "react-icons/fa6";
import { cn } from "@/lib/utils";

export const InstrumentalCard = ({ className }: { className?: string }) => {
   const { currentTheme, themeCodes } = useThemeState();
   const [data, setData] = React.useState<any>();

   React.useEffect(() => {
      let ignore = false;
      const updateData = async () => {
         const data = await getInstrumentalData(currentTheme).then(
            (r) => r.promise
         );
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
      <Card
         className={cn(
            `flex flex-col ${data ? "" : "animate-pulse"}`,
            className
         )}
      >
         <CardHeader>
            {/* <div className="flex flex-row justify-between items-center gap-6">
               <CardTitle className="text-xl">Share of Instrumental</CardTitle>
               {data ? (
                  <CardDescription className="text-xs italic">
                     {data.instrumental_hours} Hours
                  </CardDescription>
               ) : null}
            </div> */}
            <div className="flex flex-col justify-center gap-2">
               <CardTitle className="text-xl text-center">Share of Instrumental</CardTitle>
               <p className="text-muted-foreground mb-1 italic min-h-5 justify-center text-center" >
                  {data ? data.footer : " "}
               </p>
               <div className="text-primary flex justify-center text-xl">
                  {getEraIcon(currentTheme, "")}
               </div>
            </div>
         </CardHeader>
         {/* <CardContent className="grow flex flex-col p-0 px-6">
            <div className="flex-1 flex flex-col text-center mb-2">
               <p className="text-muted-foreground mb-1 italic">
                  {data ? data.footer : " "}
               </p>
               <div className="text-primary flex justify-center text-xl">
                  {getEraIcon(currentTheme, "")}
               </div>
            </div>
            <div className="grow text-8xl font-bold text-center items-center ">
               {data ? <p>{data.instrumental_share + "%"}</p> : " "}
            </div>
         </CardContent> */}
         <CardContent className="grow flex flex-col p-0 px-6 text-6xl font-bold text-center items-center">
         {data ? <p>{data.instrumental_share + "%"}</p> : " "}
         </CardContent>
         <CardFooter className="align-baseline justify-items-end p-0 px-6">
            {data ? (
               <CardDescription className="text-xs italic text-center">
                  {data.instrumental_hours} Hours
               </CardDescription>
            ) : null}
         </CardFooter>
      </Card>
   );
};
// {getEraIcon(currentTheme)}
const getEraIcon = (era: Theme, className) => {
   if (era.era == "hs") return <PiMaskSadFill className={className} />;
   if (era.era == "college") return <CiCoffeeCup className={className} />;
   if (era.era == "adult") return <MdAutoGraph className={className} />;
   return <FaDumbbell className={className} />;
};
