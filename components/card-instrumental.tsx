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

export const InstrumentalCard = ({ className }: {
    className?: string;
}) => {
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
      <Card className={cn(
        "grow flex flex-col",
        className
      )}>
         <CardHeader>
               <CardTitle className="text-center ext-xl">Instrumental Share</CardTitle>
            {data ? (
               <CardDescription className="text-center">
                  {data.instrumental_hours} Hours Played
               </CardDescription>
            ) : null}
         </CardHeader>
         <CardContent className="text-primary">
            <div className="text-9xl font-bold text-center">
               {data ? data.instrumental_share : " "}%
            </div>
         </CardContent>
         <CardFooter className="flex-1 flex flex-row justify-between text-s p-0 px-6 items-center">
         <p className="text-muted-foreground">
               {data ? data.footer : " "}
            </p>
            <span className="text-primary">{getEraIcon(currentTheme)}</span>
         </CardFooter>
      </Card>
   );
};
// {getEraIcon(currentTheme)}
const getEraIcon = (era: Theme) => {
   if (era.era == "hs") return <PiMaskSadFill />;
   if (era.era == "college") return <CiCoffeeCup />;
   if (era.era == "adult") return <MdAutoGraph />;
   return <FaDumbbell />;
};
