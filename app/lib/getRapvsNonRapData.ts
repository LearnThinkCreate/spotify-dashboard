import { GraphSeries } from "./definitions";
import prisma from "./prisma";
import { addItemToGraph } from "./data";


export async function getRapvsNonRapData() {
  const result: {}[] = await prisma.$queryRaw`
    WITH GenreCategories AS (
      SELECT
        Distinct(main_genre),
        CASE
          WHEN main_genre ILIKE '% lo-fi' OR main_genre ILIKE 'lo-fi%' OR main_genre ILIKE '% lo-fi %' THEN 'non-rap'
          WHEN main_genre ILIKE '% hip hop' OR main_genre ILIKE 'hip hop%' OR main_genre ILIKE '% hip hop %'
              OR main_genre ILIKE '% rap' OR main_genre ILIKE 'rap%' OR main_genre ILIKE '% rap %' THEN 'rap'
          ELSE 'non-rap'
        END AS genre_category
      FROM artist_metadata
    ), ArtistGenreCategory AS (
      SELECT
        am.artist_id,
        am.main_genre,
        gc.genre_category
      FROM artist_metadata am
      JOIN GenreCategories gc ON am.main_genre = gc.main_genre
    )
    SELECT
      sh.year,
      agc.genre_category,
      SUM(sh.ms_played) / 3600000 as hours_played
    FROM spotify_history sh
    JOIN ArtistGenreCategory agc ON sh.main_artist_id = agc.artist_id
    GROUP BY sh.year, agc.genre_category
    ORDER BY sh.year, hours_played DESC`;

  const graph: GraphSeries = [];

  result.forEach((item: any) => {
    addItemToGraph(graph, item.genre_category, item.year, Number(item.hours_played));
  });

  return graph;
}
