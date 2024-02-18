DELETE FROM SPOTIFY_HISTORY;
DELETE FROM TRACK_METADATA;
DELETE FROM ARTIST_METADATA;
DELETE FROM ARTIST_TRACKS;

DROP TABLE SPOTIFY_HISTORY;
DROP TABLE TRACK_METADATA;
DROP TABLE ARTIST_METADATA;
DROP TABLE ARTIST_TRACKS;

-- SELECT am.main_genre, SUM(sh.ms_played) as total_ms_played
-- FROM spotify_history sh
-- JOIN artist_metadata am ON sh.main_artist_id = am.artist_id
-- WHERE am.main_genre IS NOT NULL AND am.main_genre <> ''
-- GROUP BY am.main_genre
-- ORDER BY total_ms_played DESC
-- LIMIT 5;