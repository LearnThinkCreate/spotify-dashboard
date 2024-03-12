import { searchSpotifyData } from "@/lib/db/querySpotifyData";
import query from "@/lib/db/index";
import { formatQueryReturn } from "@/lib/db/utils";
import BarChart from "@/ui/Charts/BarChart";
import { generateDateFilters } from "@/ui/utils";

export default async function BarChartWrapper({
    height,
    chartId,
    defaultDropdownValue = 'song',
    classNames,
    searchParams
}: {
    height?: number,
    chartId?: string,
    defaultDropdownValue?: string,
    classNames?: string,
    searchParams?: any
}) {

    const year = searchParams["year"] ? Number(searchParams["year"]) : null;
    const month = searchParams["month"] ? Number(searchParams["month"]) : null;

    const dateFilters = generateDateFilters(month, year);

    let timeSelection = dateFilters.sum_units === "hours" ? "hours_played" : "minutes_played";

    let defaultFilters = [
        `${defaultDropdownValue} IS NOT NULL`, 
        `${defaultDropdownValue} != ''`
    ];

    if (dateFilters.dateFilter) {
        defaultFilters.push(dateFilters.dateFilter);
        console.log('Default Filters', defaultFilters);
    }

    const initialQuery = searchSpotifyData({
        fields: [defaultDropdownValue, `SUM(${timeSelection}) AS ${timeSelection}`],
        filters: defaultFilters,
        groupings: [defaultDropdownValue],
        limit: 10,
    });

    const initialData = await query(initialQuery);
    
    const formattedData = formatQueryReturn({
        data: initialData,
        returnType: 'graph',
        graphColumns: {
            category: defaultDropdownValue,
            x_axis: defaultDropdownValue,
            y_axis: timeSelection,
        }
    });

    return (
        <BarChart
            height={height}
            chartId={chartId}
            defaultDropdownValue={defaultDropdownValue}
            series={formattedData}
            className={classNames}
            initialYaxisTitle={dateFilters.sum_units === 'hours' ? 'Hours Played' : 'Minutes Played'}
        />
    )

}