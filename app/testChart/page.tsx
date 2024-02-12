"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import BaseChart from "@/components/Dashboard/BaseChart";
import ChartTitle from "@/components/Dashboard/ChartTitle";
import LineGraph from "@/components/Dashboard/LineGraph";
import { getGraphData } from "../lib/data";
import LineGraphOption from "@/components/Dashboard/options/LineGraphOption";
import AreaGraph from "@/components/Dashboard/AreaGraph";



const Home: React.FC = () => {
  const main_graph_data = getGraphData("main_genre");
  const secondary_genre_data = getGraphData("secondary_genre");
  const rap_vs_non_rap_data = getGraphData("rap_vs_non_rap");


  return (
    <>
      <Breadcrumb pageName="Test Chart" />

      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <div className="col-span-12">
            <BaseChart>
              <div className="mb-6 flex items-start justify-center">
              <ChartTitle title="Main Genres Over Time" />
              </div>             
                {/* Chart */}
                
                <AreaGraph data={main_graph_data} options={LineGraphOption} />
                
            </BaseChart>
        </div>
        <div className="col-span-12 xl:col-span-7">
            <BaseChart>      
            <div className="mb-6 flex items-start justify-center">
              <ChartTitle title="Secondary Genres Over Time" />
              </div>           
                {/* Chart */}
                <LineGraph data={secondary_genre_data} options={LineGraphOption} />
            </BaseChart>
        </div>
        <div className="col-span-12 xl:col-span-5">
            <BaseChart>    
            <div className="mb-6 flex items-start justify-center">
              <ChartTitle title="Rap vs. No Rap" />
              </div>             
                {/* Chart */}
                <AreaGraph data={rap_vs_non_rap_data} options={LineGraphOption} />
            </BaseChart>
        </div>
      </div>
    </>
  );
};

export default Home;
