import { cache } from 'react'
import 'server-only'

import prisma from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import { prismaEraFilters } from "@/lib/db/query-utils";
import { Theme } from "@/components/themes";
import { toTitleCase } from "@/lib/utils";

export const preloadRapData = (era: Theme) => {
   void getRapData(era);
}


export const getRapData = cache(async (era: Theme) => {
    return await prisma.spotify_data_overview
    .groupBy({
       by: ["genre_category"],
       _sum: {
          hours_played: true,
       },
       where: {
          ts: prismaEraFilters(era) as any,
       },
    })
    .then((data) =>
       data.map((item) => ({
          genre: toTitleCase(item.genre_category || ""),
          hours_played: item._sum.hours_played,
       }))
    );
 });