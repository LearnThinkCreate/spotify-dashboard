import { cache } from 'react'
import 'server-only'

import prisma from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import { Theme } from "@/components/themes";
import { prismaEraFilters, prismaGenreFilters } from "@/lib/db/query-utils";


interface getBarDataProps {
    category: string;
    currentTheme?: Theme;
    mainGenre?: string[];
    secondaryGenre?: string[];
}

export const preloadBarData = ({
    category,
    currentTheme,
    mainGenre,
    secondaryGenre,
}: getBarDataProps) => {
    void getBarData({
        category,
        currentTheme,
        mainGenre,
        secondaryGenre,
    });
}

export const getBarData = cache(async ({
    category,
    currentTheme,
    mainGenre,
    secondaryGenre,
}: getBarDataProps) => {
    const getGenres = (genres) => genres ? genres.map((genre) => genre.genre) : [];

    const query: Prisma.spotify_data_overviewGroupByArgs = {
        by: [category as Prisma.Spotify_data_overviewScalarFieldEnum],
        _sum: {
            hours_played: true,
        },
        where: {
            AND: [
                {
                    ts: prismaEraFilters(currentTheme)
                },
                {
                    OR: prismaGenreFilters({
                        main_genre: getGenres(mainGenre),
                        secondary_genre: getGenres(secondaryGenre),
                    }),
                }
            ]
        },
        take: 10,
        orderBy: {
            _sum: {
                hours_played: "desc",
            },
        },
    };

    const data = await prisma.spotify_data_overview.groupBy(query as any);

    return data.map((item) => ({
        [category]: item[category],
        hours_played: item?._sum?.hours_played,
    }));
 });