import prisma from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import { getSpotifyImage } from "./query-spotify-image";
import { getIdFromName, NAMES_TO_IDS } from "./query-spotify-utils";

interface PrismaFuncParams {
  filter?: Prisma.spotify_data_overviewWhereInput;
  offset?: number;
  take?: number;
}

const CUSTOM_CATEGORIES = {
  song: {
    primaryKey: "track_id",
    groupBy: ["song"] as Prisma.spotify_data_overviewGroupByArgs["by"],
    model: prisma.track_metadata,
    includeImage: true,
  },
  artist: {
    primaryKey: "artist_id",
    groupBy: ["artist", "artist_id", ] as Prisma.spotify_data_overviewGroupByArgs["by"],
    model: prisma.artist_metadata,
    includeImage: true,
  },
  album: {
    primaryKey: "album_id",
    groupBy: ["album"] as Prisma.spotify_data_overviewGroupByArgs["by"],
    model: prisma.track_metadata,
    includeImage: true,
  },

} as const;

export type customeCategory = keyof typeof CUSTOM_CATEGORIES;


const customTopCategory = async ({
  category,
  filter = {},
  offset = 0,
  take = 1,
}: PrismaFuncParams & { category: customeCategory }) => {
  const groupByParams = CUSTOM_CATEGORIES[category].groupBy;

  const topData = await prisma.spotify_data_overview.groupBy({
    by: groupByParams,
    _sum: {
      hours_played: true,
    },
    orderBy: {
      _sum: {
        hours_played: "desc",
      },
    },
    where: filter,
    take: take,
    skip: offset,
  })

  if (topData.length === 0) {
    return null;
  }

  const formattedData = await Promise.all(topData.map(async (record) => {
      let primaryKey = record[CUSTOM_CATEGORIES[category].primaryKey] as string;
  
      if (!primaryKey && Object.keys(NAMES_TO_IDS).includes(category)) {
        const name = record[category] as string;
        
        primaryKey = await getIdFromName({ name, type: category }) as string;
      } 

      const metadata = await getSpotifyImage({ id: primaryKey, option: category });
  
      return {
        category: category,
        value: record[category],
        primaryKey: primaryKey,
        hours_played: record._sum.hours_played,
        ...metadata,
      };
    })
  );

  return take && take === 1 ? formattedData[0] : formattedData;
};
 
export const topCategory = async ({
  category,
  filter = {},
  offset = 0,
  take = 1,
}: PrismaFuncParams & { category: customeCategory | string }) => {
  if (Object.keys(CUSTOM_CATEGORIES).includes(category)) {
    return customTopCategory({ category: category as customeCategory, filter, offset, take });
  }
  const data = await prisma.spotify_data_overview.groupBy({
    by: [category] as Prisma.spotify_data_overviewGroupByArgs["by"],
    _sum: {
      hours_played: true,
    },
    orderBy: {
      _sum: {
        hours_played: "desc",
      },
    },
    where: filter,
    take: take,
    skip: offset,
  }).then((data) => data.map((record) => ({
    category,
    value: record[category],
    hours_played: record._sum.hours_played,
    })));

  return take && take === 1 ? data[0] : data;
}