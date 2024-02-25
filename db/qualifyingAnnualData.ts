import query from "./index";
import { querySpotifyDataParams } from "./querySpotifyData";
import { createQueryFilters, formatQueryReturn } from "./utils";

interface aggregateQualifyingDataParams extends querySpotifyDataParams {
  minYears?: number;
  timeSelection?: string;
  dateGrouping?: "year" | "month" | "day";
}

export default async function qualifyingAnnualData({
  fields,
  returnType = "graph",
  limit = 6,
  minYears = null,
  filters = [],
  timeSelection = "hours_played",
  dateGrouping = "year",
}: aggregateQualifyingDataParams): Promise<any> {
  // Only include categories with minYears of data
  const categoryYearCte = `
                    CategoryYearCount AS (
                        SELECT
                            ${fields.join(", ")},
                            COUNT(DISTINCT ${dateGrouping}) as year_count
                        FROM spotify_data_overview
                        WHERE
                            ${fields.join(", ")} IS NOT NULL
                            AND ${fields.join(", ")} <> '' 
                            ${createQueryFilters({ filters })}
                        GROUP BY ${fields.join(", ")}
                        HAVING COUNT(DISTINCT ${dateGrouping}) >= ${minYears}
                    ),`;

  let totalHoursPlayedFilters;
  if (minYears) {
    totalHoursPlayedFilters = `
                        WHERE 
                            ${fields.join(", ")} IN (SELECT ${fields.join(
      ", "
    )} FROM CategoryYearCount)
                            ${createQueryFilters({ filters })}`;
  } else {
    totalHoursPlayedFilters =
      filters.length > 0 ? `WHERE ${createQueryFilters({ filters })}` : "";
  }

  const result = await query(`
                    WITH
                    ${minYears ? categoryYearCte : ""}
                    TotalHoursPlayed AS (
                        SELECT
                            ${fields.join(", ")},
                            SUM(${timeSelection}) as total_hours_played
                        FROM spotify_data_overview
                        ${totalHoursPlayedFilters}
                        GROUP BY ${fields.join(", ")}

        ORDER BY total_hours_played DESC
                        LIMIT ${limit}
                    ), CategoryHistory AS (
                        SELECT
                            ${dateGrouping},
                            ${fields.join(", ")},
                            SUM(${timeSelection}) as ${timeSelection}
                        FROM spotify_data_overview
                        WHERE ${fields.join(", ")} IN (SELECT ${fields.join(
    ", "
  )} FROM TotalHoursPlayed)
  ${filters.length > 0 ? `AND ${createQueryFilters({ filters })}` : ""}
                        GROUP BY ${dateGrouping}, ${fields.join(", ")}
                    )
                    SELECT *
                    FROM CategoryHistory
                    ORDER BY ${dateGrouping}, ${timeSelection} DESC;
                `);

  return formatQueryReturn({
    data: result,
    returnType,
    graphColumns: {
      category: fields[0],
      x_axis: dateGrouping,
      y_axis: timeSelection,
    },
  });
}
