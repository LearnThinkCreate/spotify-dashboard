import prisma from './prisma';

// Return Type
// {
//   data: [
//     {
//       artist: string;
//       hours_played: number;
//     }

export async function getTopArtistsByHoursPlayed(table_type="data-table"): Promise<any>{
  const topArtistsByHoursPlayed = await prisma.spotify_history.groupBy({
    by: ["artist", "main_artist_id"],
    _sum: {
      ms_played: true,
    },
    orderBy: {
      _sum: {
        ms_played: "desc",
      },
    },
    take: 50,
  });

  if (!topArtistsByHoursPlayed) {
    return [];
  }

  let table_columns = [];

  if (table_type === "data-table") {
    table_columns = [
      {
        Header: "Artist",
        accessor: "artist",
      },
      {
        Header: "Hours Played",
        accessor: "hours_played",
      },
    ];
  } else if (table_type === "table-two") {
    table_columns = [
      {
        key: "artist",
        label: "Artist",
      },
      {
        key: "hours_played",
        label: "Hours Played",
      },
    ];

  }

  const topArtistsByHours = topArtistsByHoursPlayed.map((artist, index) => ({
    artist: artist.artist,
    hours_played: Math.round(Number(Number(artist._sum.ms_played) / (1000 * 60 * 60)) * 100) /100,
  }));

  return {
    data: topArtistsByHours,
    columns: table_columns,
  };
}
