import {searchAggregateData} from "@/lib/db/qualifyingAnnualData";
import query from "@/lib/db/index";
import { formatQueryReturn } from "@/lib/db/utils";
import LineChart from "@/ui/Charts/LineChart";
import { generateDateFilters } from "@/ui/utils";


export default async function LineChartWrapper({
    height,
    chartId,
    defaultDropdownValue = 'main_genre'
}: {
    height?: number,
    chartId?: string,
    defaultDropdownValue?: string
}) {

    const initialQuery = searchAggregateData({
        fields:[ defaultDropdownValue ],
        limit: 10,
        minYears: 8,
        timeSelection: 'hours_played',
        dateGrouping: 'year',
        filters: [],
    });

    const initialData = await query(initialQuery);

    const formattedData = formatQueryReturn({
        data: initialData,
        returnType: 'graph',
        graphColumns: {
            category: defaultDropdownValue,
            x_axis: 'year',
            y_axis: 'hours_played',
        }
    });



    return (
        <LineChart
            height={height}
            chartId={chartId}
            defaultDropdownValue={defaultDropdownValue}
            series={formattedData}
        />
    )

}