'use server';
import prisma from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import { NAMES_TO_IDS } from "@/lib/db/query-utils";

export const queryHoursPlayed = async (where?: Prisma.spotify_data_overviewWhereInput) => (
    await prisma.spotify_data_overview
    .aggregate({
      _sum: {
        hours_played: true,
      },
      where,
    })
    .then((data) => data._sum.hours_played)
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
  return await (prisma.spotify_data_overview.groupBy as any)(query);
}