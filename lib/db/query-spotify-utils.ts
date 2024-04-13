'use server';
import prisma from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import { NAMES_TO_IDS } from "@/lib/db/query-utils";

export const queryHoursPlayed = async (where?: Prisma.spotify_historyWhereInput) => (
    await prisma.spotify_history
    .aggregate({
      _sum: {
        ms_played: true,
      },
      where,
    })
    .then((data) => data._sum.ms_played ? data._sum.ms_played  / (1000 * 60 * 60) : 0)
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

export const sdoGroupBy = async (query: Prisma.spotify_data_overviewGroupByArgs) => {
  console.log('SDO GROUP BY')
  return await (prisma.spotify_data_overview.groupBy as any)(query);
}

export const prismaGenreOptions = async (genreQuery: string) => {
  const prismaQueryParams = (genre_type: any = 'main_genre', genreQuery: string) => ({
    where: genreQuery ? {
      [genre_type]: {
        contains: genreQuery
      }
    } : {},
    by: [genre_type],
    orderBy: {
      _sum: {
        hours_played: 'desc' as any
      }
    },
    take: 10,
  });
  const main_genres = await prisma.spotify_data_overview.groupBy(prismaQueryParams('main_genre', genreQuery));
  const sub_genres = await prisma.spotify_data_overview.groupBy(prismaQueryParams('secondary_genre', genreQuery));

  let genres;
  if (main_genres.length >= 5 && sub_genres.length >= 5) {
    genres = main_genres.slice(0, 5).concat(sub_genres.slice(0, 5));
  } else if (main_genres.length >= 5) {
    genres = sub_genres.concat(main_genres.slice(0, 10 - sub_genres.length));
  } else {
    genres = main_genres.concat(sub_genres.slice(0, 10 - main_genres.length));
  }

  const genreOptions = genres.map(item => ({
    genre: item.main_genre || item.secondary_genre,
    genre_type: item.main_genre ? 'main_genre' : 'secondary_genre'
  }));
  return genreOptions;
}

export const getRapData = async () => {
  return await prisma.spotify_data_overview.groupBy({
    by: ['genre_category'],
    _sum: {
      hours_played: true,
    },
  }).then((data) => data.map((item) => ({
    genre: item.genre_category,
    hours_played: item._sum.hours_played,
  })));
}