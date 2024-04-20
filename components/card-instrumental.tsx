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
import { useMounted } from "@/hooks/use-mounted";

export const InstrumentalCard = ({ className, initialData }: { className?: string, initialData }) => {
   const { currentTheme, themeCodes } = useThemeState();
   const [data, setData] = React.useState<any>(initialData);
   const mounted = useMounted();

   React.useEffect(() => {
      if (!mounted) {
         return;
      }
      let ignore = false;
      const updateData = async () => {
         const data = await fetch(`api/instrumental/${currentTheme.era}`).then((res) => res.json());
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
      <Card className={cn(`${data ? "" : "animate-pulse"}`, className)}>
         <CardHeader>
            <div className="flex flex-col justify-center gap-2">
               <CardTitle className="text-xl text-center">
                  Share of Instrumental
               </CardTitle>
               <p className="text-muted-foreground mb-1 italic min-h-5 justify-center text-center">
                  {data ? data.footer : " "}
               </p>
               <div className="text-primary flex justify-center text-xl">
                  {getEraIcon(currentTheme, "")}
               </div>
            </div>
         </CardHeader>
         <CardContent className="flex-1 flex flex-col p-0 px-6 text-6xl font-bold text-center place-content-center">
            <div>{data ? data.instrumental_share + "%" : " "}</div>
         </CardContent>
         <CardFooter className="align-baseline items-end p-0 px-6 place-content-end">
            {data ? (
               <CardDescription className="text-xs italic">
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
