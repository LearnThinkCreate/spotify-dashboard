import prisma from "@/lib/db/prisma";
import { Prisma, artist_metadata, track_metadata } from "@prisma/client";

interface PrismaFuncParams {
  filter?: Prisma.spotify_data_overviewWhereInput;
  offset?: number;
}

export const topSongQuery = async ({
  filter = {},
}: PrismaFuncParams = {}) => {
  // Step 1: Aggregate data to find the top song with the applied filter
  const topSongData = await prisma.spotify_data_overview.groupBy({
    by: ["track_id", "song"],
    _sum: {
      hours_played: true,
    },
    orderBy: {
      _sum: {
        hours_played: "desc",
      },
    },
    where: filter,
    take: 1,
  });

  if (topSongData.length === 0) {
    return null; // Or handle this case as needed
  }

  // Step 2: Fetch track metadata for the top song
  const trackMetadata = await prisma.track_metadata.findUnique({
    where: {
      track_id: topSongData[0].track_id,
    },
  });

  if (!trackMetadata) {
    return null; // Or handle this case as needed
  }

  // Construct the result object
  return {
    song: trackMetadata.song,
    hours_played: topSongData[0]._sum.hours_played,
    image_lg: trackMetadata.image_lg,
    image_md: trackMetadata.image_md,
    image_sm: trackMetadata.image_sm,
  };
};

export const getTopArtist = async ({
  offset = 0,
  filter = {},
}: PrismaFuncParams = {}) => {
  // Step 1: Aggregate data to find the top artist
  const topArtistData = await prisma.spotify_data_overview.groupBy({
    by: ["artist_id", "artist"],
    _sum: {
      hours_played: true,
    },
    orderBy: {
      _sum: {
        hours_played: "desc",
      },
    },
    where: filter,
    take: 1,
    skip: offset,
  });

  if (topArtistData.length === 0) {
    return null; // Or handle this case as needed
  }

  // Step 2: Fetch artist metadata for the top artist
  const artistMetadata = await prisma.artist_metadata.findUnique({
    where: {
      artist_id: topArtistData[0].artist_id,
    },
  });

  if (!artistMetadata) {
    return null; // Or handle this case as needed
  }

  // Construct the result object
  return {
    artist: topArtistData[0].artist,
    artist_id: topArtistData[0].artist_id,
    hours_played: topArtistData[0]._sum.hours_played,
    image_xl: artistMetadata.image_xl,
    image_lg: artistMetadata.image_lg,
    image_md: artistMetadata.image_md,
    image_sm: artistMetadata.image_sm,
  };
}

export const topAlbumQuery = async ({
  offset = 0,
  filter = {},
}: PrismaFuncParams = {}) => {
  // Step 1: Aggregate data to find the top album with the applied filter
  const topAlbumData = await prisma.spotify_data_overview.groupBy({
    by: ["album_id", "album"],
    _sum: {
      hours_played: true,
    },
    orderBy: {
      _sum: {
        hours_played: "desc",
      },
    },
    where: filter,
    take: 1,
    skip: offset,
  });

  if (topAlbumData.length === 0) {
    return null; // Or handle this case as needed
  }

  // Step 2: Fetch album metadata
  // Since album details are in track_metadata, we fetch based on album_id
  const albumMetadata = await prisma.track_metadata.findFirst({
    where: {
      album_id: topAlbumData[0].album_id,
    },
    select: {
      album: true,
      album_release_date: true,
      image_lg: true,
      image_md: true,
      image_sm: true,
    },
  });

  if (!albumMetadata) {
    return null; // Or handle this case as needed
  }

  // Construct the result object
  return {
    album: topAlbumData[0].album,
    hours_played: topAlbumData[0]._sum.hours_played,
    image_lg: albumMetadata.image_lg,
    image_md: albumMetadata.image_md,
    image_sm: albumMetadata.image_sm,
  };
};

export const getArtistProfile = async (artistId) => {
  // Fetch the track IDs where the artist is the main artist
  const artistSongIds = await prisma.artist_tracks.findMany({
    where: {
      artist_id: artistId,
      is_main_artist: true,
    },
    select: {
      track_id: true,
    },
  });

  // Extract the track IDs to use in the next query
  const trackIds = artistSongIds.map((song) => song.track_id);

  // Calculate the average values of the specified fields
  if (trackIds.length > 0) {
    const averages = await prisma.track_metadata.aggregate({
      _avg: {
        energy: true,
        valence: true,
        danceability: true,
      },
      where: {
        track_id: {
          in: trackIds,
        },
      },
    });

    // Construct the profile object
    return [
      { name: 'Energy', value: averages._avg.energy },
      { name: 'Valence', value: averages._avg.valence },
      { name: 'Danceability', value: averages._avg.danceability },
    ];
  }

  return [];
};


const getArtistCardData = async () => {
  const topArtist = await getTopArtist({ offset: 3 });

  const topSong = await topSongQuery({
    filter: { artist_id: topArtist.artist_id },
  });

  const topAlbum = await topAlbumQuery({
    filter: { artist_id: topArtist.artist_id },
  });

  const profile = await getArtistProfile(topArtist.artist_id);

  return {
    topArtist,
    topSong,
    topAlbum,
    totalHours: topArtist['hours_played'],
    artistProfile: profile,
  };
};


export { getArtistCardData };
