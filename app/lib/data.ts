import { GraphSeries } from "./definitions";
import prisma from "./prisma";


type queryArtistDataParams = {
  category: string;
  filterYear: boolean;
};

// Function to aggregate artist data
export async function aggregateArtistData({category, filterYear}: queryArtistDataParams): Promise<{}[]> {
  const categoryYearCte = `
    CategoryYearCount AS (
      SELECT
        am.${category},
        COUNT(DISTINCT sh.year) as year_count
      FROM artist_metadata am
      JOIN spotify_history sh ON am.artist_id = sh.main_artist_id
      WHERE am.${category} IS NOT NULL AND am.${category} <> ''
      GROUP BY am.${category}
      HAVING COUNT(DISTINCT sh.year) >= 8
    ),`;

  const result: {}[] = await prisma.$queryRawUnsafe(`
    WITH
    ${filterYear ? categoryYearCte : ''} 
    TotalHoursPlayed AS (
      SELECT
        am.${category},
        SUM(sh.ms_played) / 3600000 as total_hours_played
      FROM artist_metadata am
      JOIN spotify_history sh ON am.artist_id = sh.main_artist_id
      WHERE am.${category} IN (SELECT ${category} FROM ${filterYear ? 'CategoryYearCount' : 'artist_metadata'})
      GROUP BY am.${category}
      ORDER BY total_hours_played DESC
      LIMIT 6
    ), CategoryHistory AS (
      SELECT
        sh.year,
        am.${category},
        SUM(sh.ms_played) / 3600000 as hours_played
      FROM artist_metadata am
      JOIN spotify_history sh ON am.artist_id = sh.main_artist_id
      INNER JOIN TotalHoursPlayed thp ON am.${category} = thp.${category}
      GROUP BY sh.year, am.${category}
    )
    SELECT *
    FROM CategoryHistory
    ORDER BY year;
    `);
  return result;

}

export async function queryArtistData({category, filterYear}: queryArtistDataParams) {
  const result = await aggregateArtistData({category: category, filterYear: filterYear});
  const graph: GraphSeries = [];
  const columns = [];
  result.forEach((item: any) => {
    addItemToGraph(graph, item[category], item.year, Number(item.hours_played));

    if (!columns.includes(item.year)) {
      columns.push(item.year);
    }
  });
  return graph;
}

interface GraphItem {
  graph: GraphSeries;
  category: string;
  x_axis: string | number;
  y_axis: string | number;
}

export function addItemToGraph(graph, category, x_axis, y_axis) {
  const existingItem = graph.find((item) => item.name === category);
  if (existingItem) {
    existingItem.data.push({ x: x_axis, y: y_axis });
  } else {
    graph.push({
      name: category,
      data: [{ x: x_axis, y: y_axis }],
    });
  }
};