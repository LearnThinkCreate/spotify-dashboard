import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import LineGraphOption from "@/components/Dashboard/options/LineGraphOption";
import ReusableDataTable from "@/components/Datatables/ReusableDataTable";
import ChartComponent from "@/components/Dashboard/ReusableChartComponent";
import querySpotifyData from "@/db/querySpotifyData";
import qualifyingAnnualData from "@/db/qualifyingAnnualData";



export default async function Page() {
  const artistData = await querySpotifyData({
    // 999d0 is a format string that will display the number with 1 decimal place
    fields: ["artist", "to_char(CAST(SUM(ms_played) AS FLOAT) / (1000 * 60 * 60), '999D0') AS hours_played"],
    groupings: ["artist", "artist_id"],
    orderBy: ["hours_played DESC"],
    limit: 50,
    returnType: "data-table",
  });
  const main_graph_data = await qualifyingAnnualData({
    fields: ["main_genre"],
    returnType: "graph",
    limit: 6,
    minYears: 8,
    filters: [],
    groupings: [],
    orderBy: [],
  });
  const secondary_genre_data = await qualifyingAnnualData({
    fields: ["secondary_genre"],
    returnType: "graph",
    limit: 6,
    minYears: 8,
    filters: [],
    groupings: [],
    orderBy: [],
  });
  const rap_vs_non_rap_data = await querySpotifyData({
    fields: ["genre_category", "SUM(ms_played) / (1000 * 60 * 60) as hours_played", "year"],
    groupings: ["genre_category", "year"],
    orderBy: ["year, hours_played DESC"],
    returnType: "graph",
    graphColumns: {
      category: "genre_category",
      x_axis: "year",
      y_axis: "hours_played",
    }
  });


  return (
    <>
      <Breadcrumb pageName="Test Chart" />

      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">

        <div className="col-span-12 xl:col-span-5 h-full">
          <ReusableDataTable data={artistData.data} columns={artistData.columns} defaultPageSize={5} />
        </div>
        <ChartComponent
          className="col-span-12 xl:col-span-7 h-full"
          series={main_graph_data}
          type="area"
          title="Main Genres Over Time"
          baseOptions={LineGraphOption}
        />

        <ChartComponent
          className="col-span-12 xl:col-span-7"
          series={secondary_genre_data}
          type="line"
          title="Secondary Genres Over Time"
          baseOptions={LineGraphOption}
          height={300}
        />

        <ChartComponent
          className="col-span-12 xl:col-span-5"
          series={rap_vs_non_rap_data}
          type="area"
          title="Rap vs. No Rap"
          baseOptions={LineGraphOption}
          height={300}
        />
      </div>
    </>
  );
};
