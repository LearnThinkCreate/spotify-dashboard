import { createQueryFilters } from "./utils";


interface aggregateQualifyingDataParams {
  fields: string[];
  filters?: string[];
  limit?: number;
  minYears?: number;
  timeSelection?: string;
  dateGrouping?: string;
}

export function searchAggregateData({
  fields,
  filters = [],
  timeSelection = "hours_played",
  dateGrouping = "year",
  limit,
  minYears,
}: aggregateQualifyingDataParams): string {

  const categoryYearCte = `
    CategoryYearCount AS (
        SELECT
            ${fields.join(", ")},
            COUNT(DISTINCT ${dateGrouping}) as year_count
        FROM spotify_data_overview
        WHERE
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
            ${filters.length > 0 ? `AND ${createQueryFilters({ filters })}` : ""}`
  } else {
    totalHoursPlayedFilters =
      filters.length > 0 ? `WHERE ${createQueryFilters({ filters })}` : "";
  }

  const queryString = `
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
  ORDER BY ${dateGrouping}, ${fields.join(', ')} DESC;
`

  return queryString;
}
