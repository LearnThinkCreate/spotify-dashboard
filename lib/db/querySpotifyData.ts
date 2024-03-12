import query from "./index";
import {
  createQueryFilters,
  formatQueryReturn,
  validReturnTypes,
  GraphColumns,
} from "./utils";

interface querySpotifyDataParams {
  fields: string[];
  filters?: string[];
  groupings?: string[];
  orderBy?: string[];
  limit?: number;
}

export function searchSpotifyData({
  fields,
  filters = [],
  groupings = [],
  orderBy = [],
  limit,
}: querySpotifyDataParams): string {
  const queryString = `
                SELECT
                ${fields.join(", ")}
                FROM spotify_data_overview
                ${filters.length > 0 ? `WHERE ${createQueryFilters({ filters })}` : ""}
                ${groupings.length > 0 ? `GROUP BY ${groupings.join(", ")}` : ""}
                ${orderBy.length > 0 ? `ORDER BY ${orderBy.join(", ")}` : ""}
                ${limit ? `LIMIT ${limit}` : ""}
                `;


  return queryString;

}