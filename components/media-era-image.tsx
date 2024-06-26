"use client";
import * as React from "react";
import { useThemeState } from "@/hooks/theme-state";
import { getRandomImagePath } from "@/lib/query-era-image";
import {
    Card,
    CardContent,
  } from "@/components/ui/card";
  import Image from 'next/image';
import { useMounted } from "@/hooks/use-mounted";

export const EraImage = ({ randomImagePath }) => {
    const { currentTheme, themeCodes } = useThemeState();
    const [imagePath, setImagePath] = React.useState<string>(randomImagePath);
    const mounted = useMounted();

    React.useEffect(() => {
        if (!mounted) {
            return;
          }
        let ignore = false;
        const fetchImage = async () => {
            const path = await getRandomImagePath(currentTheme);
            if (!ignore) {
                setImagePath(path);
            }
        }
        fetchImage();
        return () => {
            ignore = true;
        };
    }, [currentTheme]);

    return (
        <Card className="min-h-72 max-w-96 xl:h-full xl:max-w-full container order-first lg:order-2 flex p-0 border-none bg-transparent">
        <CardContent className="flex-1 relative">
        {imagePath ? (
            <Image
            src={imagePath}
            className="rounded-lg"
            alt="Era Image"
            fill={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={true}
        />) : <div></div>}
        </CardContent>
      </Card>
    );
}