import { cache } from 'react'
import 'server-only'

import { Theme } from "@/components/themes";
import prisma from "@/lib/db/prisma";
import { eraFilters } from "@/lib/db/query-utils";

export const preloadInstrumentalData = (era: Theme) => {
   void getInstrumentalData(era);
}


export const getInstrumentalData = cache(async (era: Theme) => {
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
 });
 