import prisma from '@/lib/db/prisma';

const IMAGE_FIELDS = ["image_lg", "image_md", "image_sm"] as const;

const METADATA_OPTIONS = {
    artist: {
        primaryKey: "artist_id",
        imageFields: ["image_xl", ...IMAGE_FIELDS],
        model: prisma.artist_metadata,
    },
    album: {
        primaryKey: "album_id",
        imageFields: IMAGE_FIELDS,
        model: prisma.track_metadata,
    },
    song: {
        primaryKey: "track_id",
        imageFields: IMAGE_FIELDS,
        model: prisma.track_metadata,
    },
}

export const getImageDict = (imageFields, value) => {
    return imageFields.reduce((acc, field) => {
      acc[field] = value;
      return acc;
    }, {} as Record<typeof imageFields[number], typeof value>);
  }

export const getSpotifyImage = async ({id, option}: {id: string, option: keyof typeof METADATA_OPTIONS}) => {
    const select = getImageDict(METADATA_OPTIONS[option].imageFields, true);
    const model = METADATA_OPTIONS[option].model;
    const where = { [METADATA_OPTIONS[option].primaryKey]: id };
    if (option === 'album') {
        return await (model as any).findFirst({ select, where })
    }

    return await (model as any).findUnique({
        where,
        select,
    });
}