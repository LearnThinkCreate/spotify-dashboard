import query from "./index";
import {
  createQueryFilters,
  formatQueryReturn,
  validReturnTypes,
  GraphColumns,
} from "./utils";

export interface querySpotifyDataParams {
  fields: string[];
  returnType?: validReturnTypes;
  filters?: string[];
  groupings?: string[];
  orderBy?: string[];
  limit?: number;
  graphColumns?: GraphColumns;
}

export default async function querySpotifyData({
  fields,
  returnType,
  filters = [],
  groupings = [],
  orderBy = [],
  limit,
  graphColumns = { category: "", x_axis: "", y_axis: "" },
}: querySpotifyDataParams): Promise<any> {
  const queryString = `
                SELECT
                    ${fields.length > 0 ? fields.join(", ") : ""}
                FROM spotify_data_overview
                ${
                  filters.length > 0
                    ? `WHERE ${createQueryFilters({ filters })}`
                    : ""
                }
                ${groupings.length > 0 ? `GROUP BY ${groupings.join(", ")}` : ""}
                ${orderBy.length > 0 ? `ORDER BY ${orderBy.join(", ")}` : ""}
                ${limit ? `LIMIT ${limit}` : ""}
                `;
  const result = await query(queryString);

  // return result;
  return formatQueryReturn({ data: result, returnType, graphColumns });
}
