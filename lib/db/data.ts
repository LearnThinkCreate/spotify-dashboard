import * as queries from "./queries";
import query from "@/lib/db";

const getArtistCardData = async () => {
  const queryResult = await query(queries.topArtistQuery({ offset: 6 }));
  const topArtist = queryResult.rows[0];

  const artistTopSong = await query(
    queries.topSongQuery({
      filter: { artist_id: topArtist.artist_id },
    })
  );
  const topSong = artistTopSong.rows[0];

  const artistTopAlbum = await query(
    queries.topAlbumQuery({
      filter: { artist_id: topArtist.artist_id },
    })
  );
  const topAlbum = artistTopAlbum.rows[0];

  const artistHoursListened = await query(`
    select sum(hours_played) as total_hours
    from spotify_data_overview
    where artist_id = '${topArtist.artist_id}'
    `);
  const totalHours = artistHoursListened.rows[0]["total_hours"];

  const artistProfile = await query(`
    with artist_songs as (
        select track_id
        from artist_tracks 
        where artist_id = '${topArtist.artist_id}' and is_main_artist = true
        )
        
        select 
            AVG(energy) as energy, AVG(valence) as valence, AVG(danceability) as danceability
        from 
            track_metadata
        where track_id in (select track_id from artist_songs)
        group by main_artist_id`);
  const profile = Object.keys(artistProfile.rows[0]).map((key) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: artistProfile.rows[0][key],
  }));

  return {
    topArtist,
    topSong,
    topAlbum,
    totalHours,
    artistProfile: profile,
  };
};




type ArtistCardData = {
  topArtist: {
    artist: string;
    artist_id: string;
    hours_played: number;
    image_xl: { url: string };
    image_lg: { url: string };
    image_md: { url: string };
    image_sm: { url: string };
  };
  topSong: {
    song: string;
    hours_played: number;
    image_lg: { url: string };
    image_md: { url: string };
    image_sm: { url: string };
  };
  topAlbum: {
    album: string;
    hours_played: number;
    image_lg: { url: string };
    image_md: { url: string };
    image_sm: { url: string };
  };
  totalHours: number;
  artistProfile: { name: string; value: any }[];
};

const getAlbumCardData = async () => {};

type AlbumCardData = {
  topAlbum: {
    album: string;
    album_id: string;
    hours_played: number;
    image_xl: { url: string };
    image_lg: { url: string };
    image_md: { url: string };
    image_sm: { url: string };
  };
  topSong: {
    song: string;
    hours_played: number;
    image_lg: { url: string };
    image_md: { url: string };
    image_sm: { url: string };
  };
  audioFeatures: { name: string; value: any }[];
};
export { getArtistCardData };
export type { ArtistCardData };
