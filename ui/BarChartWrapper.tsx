import querySpotifyData from "@/db/querySpotifyData";
import BarChart from "@/components/Charts/BarChart";
import { generateDateFilters } from "@/db/utils";

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
    console.log('Wrapper Params', searchParams)
    console.log('Type of Wrapper Params', typeof searchParams)

    const year = searchParams["year"] ? Number(searchParams["year"]) : null;
    const month = searchParams["month"] ? Number(searchParams["month"]) : null;

    console.log('Year', year, 'Month', month);

    const dateFilters = generateDateFilters(month, year);

    console.log('Date Filters', dateFilters);

    const timeDuration = dateFilters ? dateFilters.sum_units : "hours";
    let timeSelection = timeDuration === "hours" ? "hours_played" : "minutes_played";

    let defaultFilters = [
        `${defaultDropdownValue} IS NOT NULL`, 
        `${defaultDropdownValue} != ''`
    ];

    if (dateFilters.dateFilter) {
        defaultFilters.push(dateFilters.dateFilter);
        console.log('Default Filters', defaultFilters);
    }


    const initialData = await querySpotifyData({
        fields:[ defaultDropdownValue, `SUM(${timeSelection}) AS ${timeSelection}` ],
        filters: defaultFilters,
        groupings: [defaultDropdownValue],
        orderBy: [`${timeSelection} DESC`],
        limit: 10,
        returnType: 'graph',
        graphColumns: {
            category: "",
            x_axis: defaultDropdownValue,
            y_axis: timeSelection,
        }
    });

    console.log('Initial Data', initialData[0]['data']);

    return (
        <BarChart
            height={height}
            chartId={chartId}
            defaultDropdownValue={defaultDropdownValue}
            series={initialData}
            className={classNames}
            initialYaxisTitle={timeDuration === 'hours' ? 'Hours Played' : 'Minutes Played'}
        />
    )

}