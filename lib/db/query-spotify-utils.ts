"use server";
import prisma from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import {
   eraFilters,
   prismaEraFilters,
   NAMES_TO_IDS,
} from "@/lib/db/query-utils";
import { Theme } from "@/components/themes";
import { toTitleCase } from "@/lib/utils";

export const queryHoursPlayed = async (
   where?: Prisma.spotify_historyWhereInput
) =>
   await prisma.spotify_history
      .aggregate({
         _sum: {
            ms_played: true,
         },
         where,
      })
      .then((data) =>
         data._sum.ms_played ? data._sum.ms_played / (1000 * 60 * 60) : 0
      );

export const getIdFromName = async ({
   name,
   type,
}: {
   name: string;
   type: keyof typeof NAMES_TO_IDS;
}) => {
   const where = { [type]: name };
   const by = [
      NAMES_TO_IDS[type],
      type,
   ] as Prisma.spotify_data_overviewGroupByArgs["by"];

   const data = await prisma.spotify_data_overview.groupBy({
      by,
      _sum: {
         hours_played: true,
      },
      orderBy: {
         _sum: {
            hours_played: "desc",
         },
      },
      where,
      take: 1,
   });

   if (data.length === 0) {
      return null;
   }
   return data[0][NAMES_TO_IDS[type]];
};

export const sdoGroupBy = async (
   query: Prisma.spotify_data_overviewGroupByArgs
) => {
   // console.log("Server Action: sdoGroupBy")

   async function doStuff() {
      // @ts-ignore
      return await prisma.spotify_data_overview.groupBy(query);
   }
   return {
      promise: doStuff(),
   };
};

export const prismaGenreOptions = async (genreQuery: string) => {
   const prismaQueryParams = (
      genre_type: any = "main_genre",
      genreQuery: string
   ) => ({
      where: genreQuery
         ? {
              [genre_type]: {
                 contains: genreQuery,
              },
           }
         : {},
      by: [genre_type],
      orderBy: {
         _sum: {
            hours_played: "desc" as any,
         },
      },
      take: 10,
   });
   const main_genres = await prisma.spotify_data_overview.groupBy(
      prismaQueryParams("main_genre", genreQuery)
   );
   const sub_genres = await prisma.spotify_data_overview.groupBy(
      prismaQueryParams("secondary_genre", genreQuery)
   );

   let genres;
   if (main_genres.length >= 5 && sub_genres.length >= 5) {
      genres = main_genres.slice(0, 5).concat(sub_genres.slice(0, 5));
   } else if (main_genres.length >= 5) {
      genres = sub_genres.concat(main_genres.slice(0, 10 - sub_genres.length));
   } else {
      genres = main_genres.concat(sub_genres.slice(0, 10 - main_genres.length));
   }

   const genreOptions = genres.map((item) => ({
      genre: item.main_genre || item.secondary_genre,
      genre_type: item.main_genre ? "main_genre" : "secondary_genre",
   }));
   return genreOptions;
};

export const getRapData = async (era: Theme) => {
   // console.log(`Server Action: getRapData`)
   async function doStuff() {
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
   }
   return {
      promise: doStuff(),
   };
};

export const getInstrumentalData = async (era: Theme) => {
   // console.log(`Server Action: getInstrumentalData`)
   async function doStuff() {
      const filter = eraFilters(era);
      const instrumentalQuery = `
      select       
        Sum(is_instrumental::int * hours_played) as instrumental_share,
        SUM(hours_played) as total_hours
      from spotify_data_overview
      `;
      const historicInstrumental = (await prisma.$queryRawUnsafe(
         instrumentalQuery
      )) as {
         instrumental_share: number;
         total_hours: number;
      }[];

      const historicShare = (historicInstrumental[0].instrumental_share / historicInstrumental[0].total_hours);

      if (!filter) {
         return {
            instrumental_hours: historicInstrumental[0].instrumental_share.toFixed(0),
            instrumental_share: (historicShare * 100).toFixed(0),
            delta: 0,
            footer: era.instrumentalFooter,
         };
      }

      const instrumental = (await prisma.$queryRawUnsafe(
         instrumentalQuery + " where " + filter.join(" AND ")
      )) as {
         instrumental_share: number;
         total_hours: number;
      }[];

      const eraShare = (instrumental[0].instrumental_share / instrumental[0].total_hours);

      return {
         instrumental_hours: instrumental[0].instrumental_share.toFixed(0),
         instrumental_share: (eraShare * 100).toFixed(0),
         delta: ((eraShare - historicShare) / historicShare * 100).toFixed(0),
         footer: era.instrumentalFooter,
      };
   }

   return {
      promise: doStuff(),
   };
};
