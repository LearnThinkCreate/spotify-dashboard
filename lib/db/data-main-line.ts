"use server";
import prisma from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import { Theme } from "@/components/themes";
import { eraFilters } from "@/lib/db/query-utils";

const getDateGroup = (era?: Theme) => era ? 'month' : 'month';
const getEraFilter = (era?: Theme) => era ? eraFilters(era) : null;


export const getLineData = async ({
    category,
    era,
}: {
    category: string,
    era?: Theme,
}) => {
    let query;
    switch (category) {
        case 'instrumental':
            query = instrumentalQuery({ era });
            break;
        case 'hours_played':
            query = hoursListenedQuery({ era });
            break;
        default:
            query = basicLineQuery({ category, era });
    }
    return await prisma.$queryRawUnsafe(query);
};

const basicLineQuery = ({
    category = '',
    era,
}: {
    category?: string,
    era?: Theme,
}) => {
    const dateGroup = getDateGroup(era);
    const filter = getEraFilter(era);
    return `
    select 
        SUM(${category} * hours_played) / SUM(hours_played) as average_value,
        ${dateGroup} as date
    from
        spotify_data_overview
    ${filter ? `where ${filter.join(' AND ')}` : ''}
    group by 
        ${dateGroup}
    order by
        date
    `;
}

const instrumentalQuery = ({ era }: { era?: Theme }) => {
    const dateGroup = getDateGroup(era);
    const filter = getEraFilter(era);
    return `
    WITH instrumentalData AS (
        select
            track_id,
        Case 
            when instrumentalness >= 0.5 then 1
            else 0
        end as instrumental
        from track_metadata
    )
    select 
        (SUM(instrumental * hours_played) / SUM(hours_played)) AS average_value,
        ${dateGroup} as date
    from 
        spotify_data_overview
    Join instrumentalData ON spotify_data_overview.track_id = instrumentalData.track_id
    ${filter ? `where ${filter.join(' AND ')}` : ''}
    group by
        ${dateGroup}
    `;
}

const hoursListenedQuery = ({ era }: { era?: Theme }) => {
    const dateGroup = getDateGroup(era);
    const filter = getEraFilter(era);
    if (dateGroup === 'month') {
        return `
        SELECT 
            month as date,
            -- TO_CHAR(month, 'Mon') || ' ' || TO_CHAR(month, 'YY') as date,
            -- TO_CHAR(month, 'Month') || ' ' || TO_CHAR(month, 'YY') as long_month,
            SUM(hours_played) / EXTRACT(DAY FROM (date_trunc('MONTH', month) + INTERVAL '1 MONTH' - INTERVAL '1 day')) AS average_value
        FROM 
            spotify_data_overview
        ${filter ? `where ${filter.join(' AND ')}` : ''}
        group by
            month
        `;
    }
    return `
    SELECT
        year as date, 
        --EXTRACT(YEAR FROM year) AS year, 
        SUM(hours_played) / COUNT(DISTINCT ts::date) AS average_value
    FROM 
        spotify_data_overview
    ${filter ? `where ${filter.join(' AND ')}` : ''}
    GROUP BY 
        year
    ORDER BY 
        year;
    `
}