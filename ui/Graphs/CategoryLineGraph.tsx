import LineChart from "@/components/Charts/LineChart";
import { generateDateFilters } from "@/db/utils";
import dynamic from 'next/dynamic';
import qualifyingAnnualData from "@/db/qualifyingAnnualData";
import { GraphComponentProps } from "./definitions";

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

export default async function CategoryLineGraph({
    month,
    year,
    classNames,
    type = "line",
    title = '',
    height = null,
    category = 'main_genre',
    chartId = '',
    limit = 6,
    unitTime = 'hours_played'
}: GraphComponentProps
) {
    const dateFilters = generateDateFilters(month, year);

    let timeSelection;

    if (unitTime) {
        timeSelection = unitTime;
    } else {
        const timeDuration = dateFilters ? dateFilters.sum_units : "hours";
        timeSelection = timeDuration === "hours" ? "hours_played" : "minutes_played";
    }

    let data;

    if (!month && !year) {
        data = await qualifyingAnnualData({
            fields: [category],
            returnType: "graph",
            limit: limit,
            minYears: 8,
            filters: [],
            timeSelection: timeSelection,
            dateGrouping: "year",
        });
    } else if (month && year) {
        data = await qualifyingAnnualData({
            fields: [category],
            returnType: "graph",
            limit: limit,
            filters: dateFilters.dateFilter ? [dateFilters.dateFilter] : [],
            timeSelection: timeSelection,
            dateGrouping: "day",
        });
    } else if (!month && year) {
        data = await qualifyingAnnualData({
            fields: [category],
            returnType: "graph",
            limit: limit,
            filters: dateFilters.dateFilter ? [dateFilters.dateFilter] : [],
            timeSelection: timeSelection,
            dateGrouping: "month",
        });
    }

    return (
        <LineChart
            className={classNames}
            series={data}
            chartId={chartId}
            type={type}
            title={title}
            height={height}
            yaxisTitle={timeSelection === 'hours_played' ? 'Hours' : 'Minutes'}
        />
    );
}

const CATEGORIES = [
    "main_genre",
    "secondary_genre",
    "artist",
    "album",
    "song",
    "genre_category",
]