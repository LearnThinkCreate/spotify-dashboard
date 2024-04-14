"use client";
import * as React from "react";
import { useThemeState } from "@/hooks/theme-state";
import { getRandomImagePath } from "@/lib/query-era-image";
import {
    Card,
    CardContent,
  } from "@/components/ui/card";
  import Image from 'next/image';

export const EraImage = () => {
    const { currentTheme, themeCodes } = useThemeState();
    const [imagePath, setImagePath] = React.useState<string | null>();

    React.useEffect(() => {
        const fetchImage = async () => {
            let path = await getRandomImagePath(currentTheme);
            setImagePath(path);
        }
        fetchImage();
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