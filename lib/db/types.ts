import { Prisma  } from "@prisma/client";

export interface PrismaFuncParams {
    filter?: Prisma.spotify_data_overviewWhereInput;
    offset?: number;
  }

interface SpotifyImage {
url: string;
}

export type TopSongData = {
  song: string;
  hours_played: number;
  image_lg: Prisma.JsonObject;
  image_md: SpotifyImage;
  image_sm: SpotifyImage;
};

type TopArtistData = {
    artist: string;
    artist_id: string;
    hours_played: number;
    image_xl: Prisma.JsonObject;
    image_lg: Prisma.JsonObject;
    image_md: Prisma.JsonObject;
    image_sm: Prisma.JsonObject;
};

type TopAlbumData = {
    album: string;
    hours_played: number;
    image_lg: Prisma.JsonObject;
    image_md: Prisma.JsonObject;
    image_sm: Prisma.JsonObject;
};

type ArtistProfileData = {
    name: string;
    value: number | null;
};

type ArtistCardData = {
    topArtist: TopArtistData | null;
    topSong: TopSongData | null;
    topAlbum: TopAlbumData | null;
    artistProfile: ArtistProfileData[];
  };