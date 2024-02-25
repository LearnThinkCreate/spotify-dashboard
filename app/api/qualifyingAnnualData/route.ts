import { NextRequest, NextResponse } from "next/server";
import query from "@/db/index";
import {
  validReturnTypes,
  createQueryFilters,
  formatQueryReturn,
} from "@/db/utils";

// Helper to parse query parameters into an array of strings
const parseQueryParams = (
  params: URLSearchParams,
  paramName: string
): string[] => {
  const values = params.getAll(paramName);
  // Exclude empty strings
  return values.filter((value) => value !== "");
};

export async function GET(request: NextRequest) {
  const url = new URL(request.url);

  const fields = parseQueryParams(url.searchParams, "fields");
  const returnType = url.searchParams.get("returnType") as
    | validReturnTypes
    | undefined;
  const limit = url.searchParams.get("limit")
    ? parseInt(url.searchParams.get("limit"), 10)
    : undefined;
  const minYears = url.searchParams.get("minYears")
    ? parseInt(url.searchParams.get("minYears"), 10)
    : undefined;
  const filters = parseQueryParams(url.searchParams, "filters");
  const timeSelection = url.searchParams.get("timeSelection") || "hours_played";
  const dateGrouping = url.searchParams.get("dateGrouping") || "year";

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
  ORDER BY ${dateGrouping}, ${timeSelection} DESC;
`

  try {
    const result = await query(queryString);

    const formatedResult = formatQueryReturn({
      data: result,
      returnType,
      graphColumns: {
        category: fields[0],
        x_axis: dateGrouping,
        y_axis: timeSelection,
      },
    });

    return new NextResponse(JSON.stringify(formatedResult), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: "Failed to query Spotify data" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
