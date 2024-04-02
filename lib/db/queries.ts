type QueryFilter = {
    dateRange?: string,
    filter?: {
        [key: string]: string
    },
    groupBy?: string[],
    orderBy?: string[],
    limit?: number,
    offset?: number
}

export const topArtistQuery = ({ offset }: QueryFilter) => {
    return `
    with top_artist AS (
        select artist_id, artist, sum(hours_played) as hours_played
        from spotify_data_overview
        group by artist_id, artist
        order by hours_played desc
        offset ${offset}
        limit 1
        )
        select	
            top_artist.artist
            , top_artist.artist_id
            , hours_played
            , image_xl
            , image_lg
            , image_md
            , image_sm
        from top_artist
        join artist_metadata on top_artist.artist_id = artist_metadata.artist_id
    `;
}

export const topSongQuery = ({ filter }: QueryFilter) => {
    const queryString = `
    with top_song AS (
        select track_id, song, sum(hours_played) as hours_played
        from spotify_data_overview
        where ${Object.keys(filter)[0]} = '${filter[Object.keys(filter)[0]]}'
        group by track_id, song
        order by sum(hours_played) desc
        limit 1
    )
    select
        track_metadata.song
        , hours_played
        , track_metadata.image_lg
        , track_metadata.image_md
        , track_metadata.image_sm
    from top_song
    join track_metadata on top_song.track_id = track_metadata.track_id
    `;
    return queryString;
}

export const topAlbumQuery = ({ filter }: QueryFilter) => {
    return `
    with top_album AS (
        select album_id, album, sum(hours_played) as hours_played
        from spotify_data_overview
        where ${Object.keys(filter)[0]} = '${filter[Object.keys(filter)[0]]}'
        group by album_id, album
        order by sum(hours_played) desc
        limit 1
    ), album_metadata AS (
        select DISTINCT
        album_id, album, album_release_date, image_lg, image_md, image_sm
        from track_metadata
        where album_id = (select album_id from top_album)
    )
    select 
        top_album.album,
        hours_played,
        album_metadata.image_lg,
        album_metadata.image_md,
        album_metadata.image_sm
    from top_album
    join album_metadata on top_album.album_id = album_metadata.album_id
    `;
}

// select song, sum(hours_played) as hours_played
// from spotify_data_overview
// group by song
// order by sum(hours_played) desc
// limit 10


// Music Has Got Dramatically Less Energetic
// SELECT year, PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY energy) AS median_value
// FROM spotify_data_overview
// group by year;

// Less Danceable :(
// SELECT year, PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY danceability) AS median_value
// FROM spotify_data_overview
// group by year;

// Progressivly less Loud
// SELECT year, PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY loudness) AS median_value
// FROM spotify_data_overview
// group by year;

// Tempo Peaked in College lol
// SELECT year, PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY tempo) AS median_value
// FROM spotify_data_overview
// group by year;

// Insrumentals Have been taking over!
// SELECT year, AVG(instrumentalness)
// FROM spotify_data_overview
// group by year;