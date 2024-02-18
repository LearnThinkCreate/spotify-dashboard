import { query } from "./index";
import { querySpotifyDataParams } from "./querySpotifyData";
import { createQueryFilters, formatQueryReturn } from "./utils";

interface aggregateQualifyingDataParams extends querySpotifyDataParams {
  minYears: number;
}

export default async function qualifyingAnnualData({
  fields,
  returnType = "graph",
  limit = 6,
  minYears = null,
  filters = [],
}: aggregateQualifyingDataParams): Promise<any> {
  // Only include categories with minYears of data
  const categoryYearCte = `
                    CategoryYearCount AS (
                        SELECT
                            ${fields.join(", ")},
                            COUNT(DISTINCT year) as year_count
                        FROM spotify_data_overview
                        WHERE
                            ${fields.join(", ")} IS NOT NULL
                            AND ${fields.join(", ")} <> '' 
                            ${createQueryFilters({ filters })}
                        GROUP BY ${fields.join(", ")}
                        HAVING COUNT(DISTINCT year) >= ${minYears}
                    ),`;

  const result = await query(`
                    WITH
                    ${minYears ? categoryYearCte : ""}
                    TotalHoursPlayed AS (
                        SELECT
                            ${fields.join(", ")},
                            SUM(ms_played) / 3600000 as total_hours_played
                        FROM spotify_data_overview
                        ${
                          minYears
                            ? `WHERE 
                                    ${fields.join(
                                      ", "
                                    )} IN (SELECT ${fields.join(
                                ", "
                              )} FROM CategoryYearCount)
                                    ${
                                      filters.length > 0
                                        ? "AND" +
                                          createQueryFilters({ filters })
                                        : ""
                                    }
                                    `
                            : createQueryFilters({ filters })
                        }
                        GROUP BY ${fields.join(", ")}

        ORDER BY total_hours_played DESC
                        LIMIT ${limit}
                    ), CategoryHistory AS (
                        SELECT
                            year,
                            ${fields.join(", ")},
                            SUM(ms_played) / 3600000 as hours_played
                        FROM spotify_data_overview
                        WHERE ${fields.join(", ")} IN (SELECT ${fields.join(
    ", "
  )} FROM TotalHoursPlayed)
                        ${createQueryFilters({ filters })}
                        GROUP BY year, ${fields.join(", ")}
                    )
                    SELECT *
                    FROM CategoryHistory
                    ORDER BY year, hours_played DESC;
                `);

  return formatQueryReturn({
    data: result,
    returnType,
    graphColumns: {
      category: fields[0],
      x_axis: "year",
      y_axis: "hours_played",
    },
  });
}
