import { NextRequest, NextResponse } from 'next/server';
import { validReturnTypes, createQueryFilters, formatQueryReturn } from '@/db/utils';
import query from '@/db/index';

// Helper to parse query parameters into an array of strings
const parseQueryParams = (params: URLSearchParams, paramName: string): string[] => {
  const values = params.getAll(paramName);
  return values.length ? values : [];
};

export async function GET(request: NextRequest) {
  
  const url = new URL(request.url);

  // Assume all your query parameters are passed as comma-separated values for simplicity
  const fields = parseQueryParams(url.searchParams, 'fields');
  const filters = parseQueryParams(url.searchParams, 'filters');
  const groupings = parseQueryParams(url.searchParams, 'groupings');
  const orderBy = parseQueryParams(url.searchParams, 'orderBy');

  const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit'), 10) : undefined;
  const returnType = url.searchParams.get('returnType') as validReturnTypes | undefined;
  const graphColumns = url.searchParams.get('graphColumns') ? JSON.parse(url.searchParams.get('graphColumns')) : {};

  const queryString = `
                SELECT
                    ${fields.join(", ")}
                FROM spotify_data_overview
                ${filters.length > 0 ? `WHERE ${createQueryFilters({ filters })}` : ""}
                ${groupings.length > 0 ? `GROUP BY ${groupings.join(", ")}` : ""}
                ${orderBy.length > 0 ? `ORDER BY ${orderBy.join(", ")}` : ""}
                ${limit ? `LIMIT ${limit}` : ""}
                `;

  try {
    const result = await query(queryString);
    const data = formatQueryReturn({ data: result, returnType, graphColumns });
    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'Failed to query Spotify data' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

