import prisma from "@/lib/db/prisma";
import { Prisma, PrismaClient, artist_metadata, track_metadata } from "@prisma/client";
import { group } from "console";

interface PrismaFuncParams {
  filter?: Prisma.spotify_data_overviewWhereInput;
  offset?: number;
  take?: number;
}
const IMAGE_FIELDS = ["image_lg", "image_md", "image_sm"] as const;

const CATEGORIES = {
  song: {
    primaryKey: "track_id",
    imageFields: IMAGE_FIELDS,
    groupBy: ["song"] as Prisma.spotify_data_overviewGroupByArgs["by"],
    model: prisma.track_metadata,
  },
  artist: {
    primaryKey: "artist_id",
    imageFields: ["image_xl", ...IMAGE_FIELDS],
    groupBy: ["artist_id", "artist"] as Prisma.spotify_data_overviewGroupByArgs["by"],
    model: prisma.artist_metadata,
  },
  album: {
    primaryKey: "album_id",
    imageFields: IMAGE_FIELDS,
    groupBy: ["album_id", "album"] as Prisma.spotify_data_overviewGroupByArgs["by"],
    model: prisma.track_metadata,
  }
} as const;

type TopQueryCategory = keyof typeof CATEGORIES;

const getImageDict = (imageFields, value) => {
  return imageFields.reduce((acc, field) => {
    acc[field] = value;
    return acc;
  }, {} as Record<typeof imageFields[number], typeof value>);
}

export const topQuery = async ({
  category,
  filter = {},
  offset = 0,
  take = 1,
}: PrismaFuncParams & { category: TopQueryCategory }) => {
  const groupByParams = CATEGORIES[category].groupBy;

  const topData = await prisma.spotify_data_overview.groupBy({
    by: groupByParams,
    _sum: {
      hours_played: true,
    },
    orderBy: {
      _sum: {
        hours_played: "desc",
      },
    },
    where: filter,
    take: take,
    skip: offset,
  })

  if (topData.length === 0) {
    return null;
  }

  return topData[0];
};

export const getMetadata = async ({
  id,
  type,
}: {
  id: string | string[];
  type: TopQueryCategory;
}) => {
  const select = getImageDict(CATEGORIES[type].imageFields, true);
  let where;
  let model;
  console.log('id', id)

  // Select the model and construct the where clause based on the type
  switch (type) {
    case 'artist':
      model = prisma.artist_metadata;
      where = Array.isArray(id) ? { artist_id: { in: id } } : { artist_id: id };
      break;
    case 'song':
      model = prisma.track_metadata;
      where = Array.isArray(id) ? { track_id: { in: id } } : { track_id: id };
      break;
    case 'album':
      // Note: Adjust if the album metadata is in a different model than track_metadata
      model = prisma.track_metadata;
      where = Array.isArray(id) ? { album_id: { in: id } } : { album_id: id };
      break;
  }
  if (!where) {
    return undefined;
  }

  // Fetch and return the metadata
  return Array.isArray(id)
    ? model.findMany({ select, where }) 
    : ( type === 'album' ? model.findFirst({ select, where }) : model.findUnique({ select, where }) )
};

export const topSongQuery = async ({
  filter = {},
}: PrismaFuncParams = {}) => {
  // Step 1: Aggregate data to find the top song with the applied filter
  const topSongData = await topQuery({
    category: "song",
    filter,
  });

  if (!topSongData) return;

  const res = await prisma.spotify_data_overview.groupBy({
    by: ["track_id", "song"],
    _sum: {
      hours_played: true,
    },
    orderBy: {
      _sum: {
        hours_played: "desc",
      },
    },
    where: {
      song: topSongData.song,
    },
    take: 1,
    skip: 1,
  });
  if (res.length === 0 || !res[0].track_id) return;
  const metadata = await getMetadata({ id: res[0].track_id, type: 'song' })
  const trackMetadata = metadata ? metadata : getImageDict(CATEGORIES['artist'].imageFields, null);
  return {
    song: topSongData.song,
    hours_played: topSongData._sum.hours_played,
    ...trackMetadata
  };
};

export const getTopArtist = async ({
  offset = 0,
  filter = {},
}: PrismaFuncParams = {}) => {
  // Step 1: Aggregate data to find the top artist
  const topArtistData = await topQuery({
    category: "artist",
    filter,
    offset,
  });
  if (!topArtistData || !topArtistData.artist_id) return null;
  const metadata = await getMetadata({ id: topArtistData.artist_id, type: 'artist' });
  const artistMetadata = metadata ? metadata : getImageDict(CATEGORIES['artist'].imageFields, null);
  return {
    artist: topArtistData.artist,
    artist_id: topArtistData.artist_id,
    hours_played: topArtistData._sum.hours_played,
    ...artistMetadata,
  };
}

export const getTopAlbum = async ({
  offset = 0,
  filter = {},
}: PrismaFuncParams = {}) => {
  const topAlbumData = await topQuery({ category: "album", filter, offset });
  if (!topAlbumData || !topAlbumData.album_id) {
    return null;
  }
  const metadata = await getMetadata({ id: topAlbumData.album_id, type: 'album'});
  const albumMetadata = metadata ? metadata : getImageDict(CATEGORIES['album'].imageFields, null);
  return {
    album: topAlbumData.album,
    hours_played: topAlbumData._sum.hours_played,
    ...albumMetadata,
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
  const trackIds = artistSongIds.map((song) => song.track_id) as string[];

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
  if (!topArtist) return;
  const topSong = await topSongQuery({
    filter: { artist_id: topArtist.artist_id },
  });
  const topAlbum = await getTopAlbum({
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
