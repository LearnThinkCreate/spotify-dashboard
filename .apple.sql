-- Get Qalifying Genres
SELECT main_genre
FROM (
  SELECT am.main_genre, COUNT(DISTINCT sh.year) as year_count
  FROM artist_metadata am
  JOIN spotify_history sh ON am.artist_id = sh.main_artist_id
  WHERE am.main_genre IS NOT NULL AND am.main_genre <> ''
  GROUP BY am.main_genre
) subquery
WHERE year_count >= 8
ORDER BY main_genre;

-- Categorize Genres as Rap or Non Rap
-- If the genre contains rap or hip hop, it is rap
SELECT main_genre, genre_category
from (
	SELECT Distinct(main_genre), 
		CASE
			WHEN main_genre ILIKE '% lo-fi'  OR main_genre ILIKE 'lo-fi%' OR main_genre ILIKE '% lo-fi %' THEN  'non-rap'
			WHEN main_genre ILIKE '% hip hop' OR main_genre ILIKE 'hip hop%' OR main_genre ILIKE '% hip hop %'
				OR main_genre ILIKE '% rap' OR main_genre ILIKE 'rap%' OR main_genre ILIKE '% rap %' THEN 'rap'
			ELSE 'non-rap'
		END AS genre_category
		FROM artist_metadata
) genres

-- Sum of hours played for each genre, for each year, if the genre is a qualifying genre
-- LIMIT 5;
WITH GenreYearCount AS (
  SELECT
    am.main_genre,
    COUNT(DISTINCT sh.year) as year_count
  FROM artist_metadata am
  JOIN spotify_history sh ON am.artist_id = sh.main_artist_id
  WHERE am.main_genre IS NOT NULL AND am.main_genre <> ''
  GROUP BY am.main_genre
  HAVING COUNT(DISTINCT sh.year) >= 8
), TotalHoursPlayed AS (
  SELECT
    am.main_genre,
    SUM(sh.ms_played) / 3600000 as total_hours_played
  FROM artist_metadata am
  JOIN spotify_history sh ON am.artist_id = sh.main_artist_id
  WHERE am.main_genre IN (SELECT main_genre FROM GenreYearCount)
  GROUP BY am.main_genre
  ORDER BY total_hours_played DESC
  LIMIT 6
), GenreHistory AS (
  SELECT
    sh.year,
    am.main_genre,
    SUM(sh.ms_played) / 3600000 as hours_played
  FROM artist_metadata am
  JOIN spotify_history sh ON am.artist_id = sh.main_artist_id
  INNER JOIN TotalHoursPlayed thp ON am.main_genre = thp.main_genre
  GROUP BY sh.year, am.main_genre
)
SELECT *
FROM GenreHistory
ORDER BY hours_played DESC, year, main_genre;


-- Sum of hours played for rap vs non-rap, for each year
SELECT sh.year, artist_genre_category.genre_category, SUM(sh.ms_played) / 3600000 as hours_played
FROM spotify_history sh
JOIN (
SELECT am.artist_id, genres.main_genre, genres.genre_category
from artist_metadata am
	JOIN (
		SELECT Distinct(main_genre), 
			CASE
				WHEN main_genre ILIKE '% lo-fi'  OR main_genre ILIKE 'lo-fi%' OR main_genre ILIKE '% lo-fi %' THEN  'non-rap'
				WHEN main_genre ILIKE '% hip hop' OR main_genre ILIKE 'hip hop%' OR main_genre ILIKE '% hip hop %'
					OR main_genre ILIKE '% rap' OR main_genre ILIKE 'rap%' OR main_genre ILIKE '% rap %' THEN 'rap'
				ELSE 'non-rap'
			END AS genre_category
			FROM artist_metadata
	) genres ON am.main_genre = genres.main_genre
) artist_genre_category ON sh.main_artist_id = artist_genre_category.artist_id
GROUP BY sh.year, artist_genre_category.genre_category
ORDER BY hours_played desc, sh.year, artist_genre_category.genre_category;
