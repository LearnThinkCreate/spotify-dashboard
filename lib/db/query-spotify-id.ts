import prisma from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";

export const NAMES_TO_IDS = {
  song: "track_id",
  artist: "artist_id",
  album: "album_id",
} as const;

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
