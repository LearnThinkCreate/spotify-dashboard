import prisma from "@/lib/db/prisma";
import { Prisma, PrismaClient, artist_metadata, track_metadata } from "@prisma/client";
import { group } from "console";

interface PrismaFuncParams {
  filter?: Prisma.spotify_data_overviewWhereInput;
  offset?: number;
  take?: number;
}
const IMAGE_FIELDS = ["image_lg", "image_md", "image_sm"] as const;

const CUSTOM_CATEGORIES = {
  song: {
    primaryKey: "track_id",
    imageFields: IMAGE_FIELDS,
    groupBy: ["song"] as Prisma.spotify_data_overviewGroupByArgs["by"],
    model: prisma.track_metadata,
    includeImage: true,
  },
  artist: {
    primaryKey: "artist_id",
    imageFields: ["image_xl", ...IMAGE_FIELDS],
    groupBy: ["artist", "artist_id", ] as Prisma.spotify_data_overviewGroupByArgs["by"],
    model: prisma.artist_metadata,
    includeImage: true,
  },
  album: {
    primaryKey: "album_id",
    imageFields: IMAGE_FIELDS,
    groupBy: ["album"] as Prisma.spotify_data_overviewGroupByArgs["by"],
    model: prisma.track_metadata,
    includeImage: true,
  },

} as const;

type CustomQueryCategory = keyof typeof CUSTOM_CATEGORIES;

export const getImageDict = (imageFields, value) => {
  return imageFields.reduce((acc, field) => {
    acc[field] = value;
    return acc;
  }, {} as Record<typeof imageFields[number], typeof value>);
}

export const getMetadata = async ({
  id,
  type,
}: {
  id: string | string[];
  type: CustomQueryCategory;
}) => {
  const select = getImageDict(CUSTOM_CATEGORIES[type].imageFields, true);
  let where;
  let model;

  // Select the model and construct the where clause based on the type
  switch (type) {
    case 'artist':
      model = prisma.artist_metadata;
      where = Array.isArray(id) ? { artist_id: { in: id } } : { artist_id: id };
      break;
    case 'song':
      model = prisma.track_metadata;
      where = Array.isArray(id) ? { track_id: { in: id } } : { track_id: id };
      break;
    case 'album':
      // Note: Adjust if the album metadata is in a different model than track_metadata
      model = prisma.track_metadata;
      where = Array.isArray(id) ? { album_id: { in: id } } : { album_id: id };
      break;
  }
  if (!where) {
    return undefined;
  }

  // Fetch and return the metadata
  return Array.isArray(id)
    ? model.findMany({ select, where }) 
    : ( type === 'album' ? model.findFirst({ select, where }) : model.findUnique({ select, where }) )
};

const NAMES_TO_IDS = {
  song: 'track_id',
  artist: 'artist_id',
  album: 'album_id',
} as const;

export const getIdFromName = async ({
  name,
  type,
}: {
  name: string;
  type: keyof typeof NAMES_TO_IDS;
}) => {
 
  
  const where = { [type]: name };
  const by = [NAMES_TO_IDS[type], type] as Prisma.spotify_data_overviewGroupByArgs["by"];

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
}

export const customTopQuery = async ({
  category,
  filter = {},
  offset = 0,
  take = 1,
}: PrismaFuncParams & { category: CustomQueryCategory }) => {
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
      let primaryKey = record[CUSTOM_CATEGORIES[category].primaryKey];
  
      if (!primaryKey && Object.keys(NAMES_TO_IDS).includes(category)) {
        const name = record[category] as string;
        
        primaryKey = await getIdFromName({ name, type: category });
      }

      let metadata;
      if (CUSTOM_CATEGORIES[category].includeImage && primaryKey) {
        metadata = await getMetadata({ id: primaryKey, type: category });
      }
  
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
 
export const topQuery = async ({
  category,
  filter = {},
  offset = 0,
  take = 1,
}: PrismaFuncParams & { category: CustomQueryCategory | string }) => {
  // Check if the category is a CustomQueryCategory or a generic string
  if (Object.keys(CUSTOM_CATEGORIES).includes(category)) {
    return customTopQuery({ category: category as CustomQueryCategory, filter, offset, take });
  }
  const data = prisma.spotify_data_overview.groupBy({
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
  });

  return (await data).map((record) => ({
    category,
    value: record[category],
    hours_played: record._sum.hours_played,
  }));
}