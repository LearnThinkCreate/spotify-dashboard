import { themes, Theme } from "@/components/themes";
import prisma from "@/lib/db/prisma";

export const formatFilterParam = (filter) => Array.isArray(filter) ? filter : (filter ? [filter] : []);

export const eraFilters = (era: Theme) => {
  const filters = {};
  if (era.minDate) filters['gte'] = era.minDate;
  if (era.maxDate) filters['lt'] = era.maxDate;
  return filters;
}

export const prismaGenreFilters = ({ main_genre, secondary_genre }) => {
  const filters = [];
  if (main_genre) filters.push({ main_genre: { in: formatFilterParam(main_genre) } });
  if (secondary_genre) filters.push({ secondary_genre: { in: formatFilterParam(secondary_genre) } });
  return filters;
}

export const prismaGenreOptions = async (genreQuery: string) => {
  const prismaQueryParams = (genre_type: any = 'main_genre', genreQuery: string) => ({
    where: genreQuery ? {
      [genre_type]: {
        contains: genreQuery
      }
    } : {},
    by: [genre_type],
    orderBy: {
      _sum: {
        hours_played: 'desc' as any
      }
    },
    take: 10,
  });
  const main_genres = await prisma.spotify_data_overview.groupBy(prismaQueryParams('main_genre', genreQuery));
  const sub_genres = await prisma.spotify_data_overview.groupBy(prismaQueryParams('secondary_genre', genreQuery));

  let genres;
  if (main_genres.length >= 5 && sub_genres.length >= 5) {
    genres = main_genres.slice(0, 5).concat(sub_genres.slice(0, 5));
  } else if (main_genres.length >= 5) {
    genres = sub_genres.concat(main_genres.slice(0, 10 - sub_genres.length));
  } else {
    genres = main_genres.concat(sub_genres.slice(0, 10 - main_genres.length));
  }

  const genreOptions = genres.map(item => ({
    genre: item.main_genre || item.secondary_genre,
    genre_type: item.main_genre ? 'main_genre' : 'secondary_genre'
  }));
  return genreOptions;
}