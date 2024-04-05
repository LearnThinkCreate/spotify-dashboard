import * as React from "react";
import query from "@/lib/db";
import HistoryLineChart from "@/components/graphics/line-chart";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import GraphDropDown from "@/components/graphics/graph-dropdown";
import  { LineGraphOptions } from "@/components/graphics/options";
import { EraFilter } from "@/components/era-filter";
import { ThemeWrapper } from "@/components/theme-wrapper";
import { basicLineQuery } from "@/lib/db/utils";

export default async function Page({
  searchParams
}) {
  const option = (
    searchParams.historyValue 
    ? LineGraphOptions.find(option => option.value === searchParams.historyValue) 
    : LineGraphOptions[0]
    );

  const queryString = option.customQuery ? option.customQuery(''): basicLineQuery({category: option.value, dateGroup: 'year'});

  const data = await query(queryString);

  return (
    <>
        <div className="flex flex-col flex-1 p-4">
          <EraFilter />
          <ThemeWrapper className="flex flex-1" >
          <Card className="flex flex-col flex-1 overflow-hidden">
              <CardHeader>
              <div className="flex flex-col gap-5 lg:flex-row lg:gap-0 justify-between items-center"> 
                <div>
                <CardTitle className="text-center lg:text-justify">{option.label}</CardTitle>
                <CardDescription>{option.description}</CardDescription>
                </div>
                <GraphDropDown paramValue={'historyValue'}  /> 
                </div>
              </CardHeader>             
            <CardContent className="flex-1">
              <HistoryLineChart
                data={JSON.stringify(data["rows"])}
                historyValue={option.value}
              />
            </CardContent>
          </Card>
          </ThemeWrapper>
        </div>
    </>
  );
}

