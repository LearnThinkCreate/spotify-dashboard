import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import BaseChart from "@/components/Dashboard/BaseChart";
import ChartTitle from "@/components/Dashboard/ChartTitle";
import LineGraph from "@/components/Dashboard/LineGraph";
import {
  queryArtistData
} from "../lib/data";
import { getRapvsNonRapData } from "../lib/getRapvsNonRapData";
import { getTopArtistsByHoursPlayed } from "../lib/getTopArtistsByHoursPlayed";
import LineGraphOption from "@/components/Dashboard/options/LineGraphOption";
import AreaGraph from "@/components/Dashboard/AreaGraph";
import ReusableDataTable from "@/components/Datatables/ReusableDataTable";
import ChartComponent from "@/components/Dashboard/ReusableChartComponent";



export default async function Page() {
  const artistData = await getTopArtistsByHoursPlayed();
  const secondary_genre_data = await queryArtistData({ category: "secondary_genre", filterYear: true });
  const main_graph_data = await queryArtistData({ category: "main_genre", filterYear: true })
  const rap_vs_non_rap_data = await getRapvsNonRapData();

  return (
    console.log(main_graph_data[0]['data']),
    console.log(secondary_genre_data),
    <>
      <Breadcrumb pageName="Test Chart" />

      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <div className="col-span-12 xl:col-span-5 h-full">
          <ReusableDataTable data={artistData.data} columns={artistData.columns} defaultPageSize={5} />
        </div>
        <div className="col-span-12 xl:col-span-7 h-full">
          <BaseChart className="h-full">
            <div className="flex items-start justify-center">
              <ChartTitle title="Main Genres Over Time" />
            </div>
            <AreaGraph data={main_graph_data} options={LineGraphOption} />
          </BaseChart>
        </div>

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
