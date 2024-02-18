import { query } from "./index";
import {
  createQueryFilters,
  formatQueryReturn,
  validReturnTypes,
  GraphColumns
} from "./utils";

export interface querySpotifyDataParams {
  fields: string[];
  returnType?: validReturnTypes;
  filters?: {
    field: string;
    value: string;
    operator: string;
  }[];
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
                    ${fields.join(", ")}
                FROM spotify_data_overview
                ${createQueryFilters({ filters })}
                GROUP BY ${groupings.join(", ")}
                ${orderBy.length > 0 ? `ORDER BY ${orderBy.join(", ")}` : ""}
                ${limit ? `LIMIT ${limit}` : ""}
                `;
  const result = await query(queryString);

  // return result;
  return formatQueryReturn({ data: result, returnType, graphColumns });
}
